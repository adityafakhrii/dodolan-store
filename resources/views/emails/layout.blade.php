<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ $title ?? 'Dodolan Store' }}</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: 0 !important; }
            .content-padding { padding: 24px 20px !important; }
            .header-padding { padding: 24px 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 40px 10px; background-color: #f1f5f9; color: #1e293b;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center">
                <!-- Outer Card Container -->
                <table class="email-container" border="0" cellpadding="0" cellspacing="0" width="580" style="max-width: 580px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06); border: 1px solid #e2e8f0;">
                    
                    <!-- Header Section with Dark Accent -->
                    <tr>
                        <td class="header-padding" align="center" style="background-color: #0f172a; padding: 32px 40px; border-bottom: 3px solid #059669;">
                            <a href="{{ config('app.url') }}" target="_blank" style="text-decoration: none; display: inline-block;">
                                <img src="{{ config('app.url') }}/assets/logo/logo-white.png" alt="Dodolan Store Logo" height="36" style="height: 36px; max-height: 36px; width: auto; display: block; border: 0;" />
                            </a>
                            <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 600;">
                                Enterprise IoT &amp; Telematics Solutions
                            </p>
                        </td>
                    </tr>

                    <!-- Main Content Body -->
                    <tr>
                        <td class="content-padding" style="padding: 40px 40px 32px 40px; background-color: #ffffff;">
                            @yield('content')
                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
                            <p style="margin: 0 0 6px 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                                Butuh bantuan teknis? Hubungi kami via <a href="{{ config('app.url') }}/kontak" style="color: #059669; text-decoration: underline; font-weight: 600;">Pusat Bantuan</a> atau WhatsApp CS kami.
                            </p>
                            <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                                &copy; {{ date('Y') }} {{ config('app.name', 'Dodolan Store') }}. Hak cipta dilindungi undang-undang.
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Bottom Meta Note -->
                <p style="margin: 20px 0 0 0; text-align: center; font-size: 11px; color: #94a3b8;">
                    Email ini dikirim secara otomatis oleh sistem Dodolan Store. Mohon tidak membalas langsung ke alamat ini.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
