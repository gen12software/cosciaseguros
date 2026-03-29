import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

// Rate limiting: máximo 5 envíos por IP cada 10 minutos
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
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

export async function POST(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (!checkRateLimit(ip)) {
        return NextResponse.json({ error: 'Demasiados intentos. Esperá unos minutos.' }, { status: 429 });
    }

    try {
        const body = await request.json();
        const { name, email, phone, service, message } = body;

        // Validación server-side
        if (
            typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 100 ||
            typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 254 ||
            typeof phone !== 'string' || phone.trim().length === 0 || phone.trim().length > 30 ||
            typeof service !== 'string' || service.trim().length === 0 || service.trim().length > 100 ||
            typeof message !== 'string' || message.trim().length === 0 || message.trim().length > 2000
        ) {
            return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 });
        }

        const safeName = escapeHtml(name.trim());
        const safeEmail = escapeHtml(email.trim());
        const safePhone = escapeHtml(phone.trim());
        const safeService = escapeHtml(service.trim());
        const safeMessage = escapeHtml(message.trim());

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: process.env.CONTACT_RECEIVER_EMAIL || 'cosciaasesores@gmail.com',
            subject: `📧 CONSULTA WEB: ${safeName} - ${safeService.toUpperCase()}`,
            replyTo: safeEmail,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #0c4a6e; color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Nueva Consulta de Servicio</h1>
                    </div>
                    <div style="padding: 30px; color: #333;">
                        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Información de Contacto</h2>
                        <p><strong>Nombre:</strong> ${safeName}</p>
                        <p><strong>Email:</strong> ${safeEmail}</p>
                        <p><strong>Teléfono:</strong> ${safePhone}</p>
                        <p><strong>Servicio de interés:</strong> ${safeService.toUpperCase()}</p>

                        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;">Mensaje</h2>
                        <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${safeMessage}</p>

                        <p style="margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; pt: 10px;">
                            Este mensaje fue enviado desde el formulario de contacto de Coscia Asesores.
                        </p>
                    </div>
                </div>
            `
        });

        if (error) {
            return NextResponse.json({ error: 'Error al enviar el mensaje.' }, { status: 400 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });

    } catch {
        return NextResponse.json(
            { error: 'Error al procesar la consulta' },
            { status: 500 }
        );
    }
}
