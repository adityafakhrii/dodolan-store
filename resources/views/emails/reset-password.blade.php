@extends('emails.layout', ['title' => 'Atur Ulang Kata Sandi — Dodolan Store'])

@section('content')
    <!-- Category / Topic Tag -->
    <div style="margin-bottom: 12px;">
        <span style="display: inline-block; color: #059669; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
            Keamanan &amp; Akses Akun
        </span>
    </div>

    <!-- Title -->
    <h1 style="margin: 0 0 16px 0; color: #0f172a; font-size: 22px; font-weight: 800; line-height: 1.3;">
        Permintaan Atur Ulang Kata Sandi
    </h1>

    <!-- Greeting & Intro -->
    <p style="margin: 0 0 16px 0; color: #334155; font-size: 14px; line-height: 1.6;">
        Halo <strong>{{ $user->name ?? 'Pelanggan Dodolan' }}</strong>,
    </p>
    <p style="margin: 0 0 24px 0; color: #334155; font-size: 14px; line-height: 1.6;">
        Kami menerima permintaan untuk mengatur ulang kata sandi akun Dodolan Store Anda. Silakan klik tombol di bawah ini untuk melanjutkan pembuatan kata sandi baru:
    </p>

    <!-- Action Button (Centered Emerald Button) -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" style="border-radius: 12px; background-color: #059669;">
                            <a href="{{ $url }}" target="_blank" style="display: inline-block; padding: 14px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px; letter-spacing: 0.02em;">
                                Atur Ulang Kata Sandi &rarr;
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Expiration Security Notice Box -->
    <div style="background-color: #f8fafc; border-left: 4px solid #059669; border-radius: 8px; padding: 14px 18px; margin: 24px 0;">
        <p style="margin: 0 0 6px 0; color: #0f172a; font-size: 13px; font-weight: 700;">
            Informasi Keamanan:
        </p>
        <p style="margin: 0; color: #475569; font-size: 12px; line-height: 1.5;">
            Tautan reset kata sandi ini hanya berlaku selama <strong>{{ $count ?? 60 }} menit</strong>. Jika Anda tidak pernah meminta pengaturan ulang kata sandi, abaikan email ini dan akun Anda akan tetap aman.
        </p>
    </div>

    <!-- Sign-off -->
    <p style="margin: 24px 0 0 0; color: #64748b; font-size: 13px; line-height: 1.5;">
        Salam hangat,<br>
        <strong style="color: #0f172a;">Tim Dodolan Store</strong>
    </p>

    <!-- Troubleshooting Fallback Link -->
    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px dashed #e2e8f0;">
        <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 11px; line-height: 1.5;">
            Jika tombol di atas tidak berfungsi, salin dan tempel tautan berikut ke peramban (browser) Anda:
        </p>
        <p style="margin: 0; word-break: break-all; font-size: 11px; line-height: 1.4;">
            <a href="{{ $url }}" style="color: #059669; text-decoration: underline;">{{ $url }}</a>
        </p>
    </div>
@endsection
