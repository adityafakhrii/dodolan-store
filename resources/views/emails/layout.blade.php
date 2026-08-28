<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Dodolan Store' }}</title>
    <style>
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            outline: none;
            text-decoration: none;
        }
        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            background-color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #334155;
        }
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
            }
            .content-box {
                padding: 28px 20px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 40px 16px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center">
                <table class="email-container" border="0" cellpadding="0" cellspacing="0" width="540" style="max-width: 540px; width: 100%;">
                    
                    <!-- Clean Brand Header -->
                    <tr>
                        <td align="left" style="padding: 0 0 24px 4px;">
                            <a href="{{ config('app.url') }}" target="_blank" style="text-decoration: none; display: inline-block;">
                                <img src="{{ config('app.url') }}/assets/logo/logo-dark.png" alt="Dodolan Store" height="32" style="height: 32px; max-height: 32px; width: auto; display: block; border: 0;" />
                            </a>
                        </td>
                    </tr>

                    <!-- Main Clean Card -->
                    <tr>
                        <td class="content-box" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 36px 36px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);">
                            @yield('content')
                        </td>
                    </tr>

                    <!-- Minimal Clean Footer -->
                    <tr>
                        <td style="padding: 24px 8px 0 8px; text-align: center;">
                            <p style="margin: 0 0 6px 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                                &copy; {{ date('Y') }} Dodolan Store &bull; Enterprise IoT &amp; Telematics
                            </p>
                            <p style="margin: 0; color: #cbd5e1; font-size: 11px;">
                                Email otomatis dari sistem &bull; <a href="{{ config('app.url') }}/kontak" style="color: #94a3b8; text-decoration: underline;">Bantuan</a>
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
