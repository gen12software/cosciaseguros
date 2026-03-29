import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

// Rate limiting: máximo 3 envíos por IP cada 10 minutos
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return true;
    }
    if (entry.count >= RATE_LIMIT) return false;
    entry.count++;
    return true;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{2}:\d{2}$/;

interface ImageAttachment {
    filename: string;
    content: string;
    type: string;
}

export async function POST(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (!checkRateLimit(ip)) {
        return NextResponse.json({ error: 'Demasiados intentos. Esperá unos minutos.' }, { status: 429 });
    }

    try {
        const body = await request.json();
        const { name, email, phone, company, otherCompany, claimType, date, time, location, description, images } = body;

        // Validación server-side
        if (
            typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 100 ||
            typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 254 ||
            typeof phone !== 'string' || phone.trim().length === 0 || phone.trim().length > 30 ||
            typeof company !== 'string' || company.trim().length === 0 || company.trim().length > 100 ||
            typeof claimType !== 'string' || claimType.trim().length === 0 || claimType.trim().length > 100 ||
            typeof date !== 'string' || !DATE_REGEX.test(date) ||
            typeof time !== 'string' || !TIME_REGEX.test(time) ||
            typeof location !== 'string' || location.trim().length === 0 || location.trim().length > 300 ||
            typeof description !== 'string' || description.trim().length === 0 || description.trim().length > 3000
        ) {
            return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 });
        }

        if (company === 'otro' && (typeof otherCompany !== 'string' || otherCompany.trim().length === 0 || otherCompany.trim().length > 100)) {
            return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 });
        }

        if (!Array.isArray(images) || images.length === 0) {
            return NextResponse.json({ error: 'Se requieren imágenes adjuntas.' }, { status: 400 });
        }

        const companyDisplay = company === 'otro'
            ? `OTRA (${escapeHtml(otherCompany.trim())})`
            : escapeHtml(company.toUpperCase());

        const safeName = escapeHtml(name.trim());
        const safeEmail = escapeHtml(email.trim());
        const safePhone = escapeHtml(phone.trim());
        const safeClaimType = escapeHtml(claimType.trim());
        const safeDate = escapeHtml(date);
        const safeTime = escapeHtml(time);
        const safeLocation = escapeHtml(location.trim());
        const safeDescription = escapeHtml(description.trim());

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: process.env.CONTACT_RECEIVER_EMAIL || 'cosciaasesores@gmail.com',
            subject: `🚨 NUEVO SINIESTRO: ${safeName} - ${companyDisplay}`,
            replyTo: safeEmail,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Reporte de Siniestro</h1>
                    </div>
                    <div style="padding: 30px; color: #333;">
                        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Datos del Asegurado</h2>
                        <p><strong>Nombre:</strong> ${safeName}</p>
                        <p><strong>Email:</strong> ${safeEmail}</p>
                        <p><strong>Teléfono:</strong> ${safePhone}</p>
                        <p><strong>Compañía:</strong> ${companyDisplay}</p>

                        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;">Detalles del Hecho</h2>
                        <p><strong>Tipo:</strong> ${safeClaimType.toUpperCase()}</p>
                        <p><strong>Fecha:</strong> ${safeDate}</p>
                        <p><strong>Hora:</strong> ${safeTime}</p>
                        <p><strong>Lugar:</strong> ${safeLocation}</p>

                        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;">Descripción</h2>
                        <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${safeDescription}</p>

                        <p style="margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; pt: 10px;">
                            Este mensaje fue enviado desde el formulario de siniestros de Coscia Asesores.
                        </p>
                    </div>
                </div>
            `,
            attachments: images.map((img: ImageAttachment) => ({
                filename: img.filename,
                content: Buffer.from(img.content, 'base64'),
            }))
        });

        if (error) {
            return NextResponse.json({ error: 'Error al enviar el reporte.' }, { status: 400 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });

    } catch {
        return NextResponse.json(
            { error: 'Error al procesar el reporte' },
            { status: 500 }
        );
    }
}
