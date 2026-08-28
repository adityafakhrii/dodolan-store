@extends('emails.layout', ['title' => 'Atur Ulang Kata Sandi'])

@section('content')
    <h1 style="margin: 0 0 18px 0; color: #0f172a; font-size: 18px; font-weight: 600; line-height: 26px;">
        Atur Ulang Kata Sandi
    </h1>

    <p style="margin: 0 0 14px 0; color: #334155; font-size: 14px; line-height: 24px;">
        Halo {{ $user->name ?? 'Pelanggan' }},
    </p>

    <p style="margin: 0 0 24px 0; color: #334155; font-size: 14px; line-height: 24px;">
        Kami menerima permintaan untuk mengatur ulang kata sandi akun Dodolan Store Anda. Klik tombol di bawah ini untuk membuat kata sandi baru:
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0 28px 0;">
        <tr>
            <td align="left">
                <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" style="border-radius: 8px; background-color: #059669;">
                            <a href="{{ $url }}" target="_blank" style="display: inline-block; padding: 11px 22px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                                Atur Ulang Kata Sandi
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <p style="margin: 0 0 12px 0; color: #64748b; font-size: 13px; line-height: 20px;">
        Tautan ini berlaku selama {{ $count ?? 60 }} menit. Jika Anda tidak meminta reset kata sandi, tidak ada tindakan lebih lanjut yang diperlukan.
    </p>

    <p style="margin: 20px 0 0 0; color: #64748b; font-size: 13px; line-height: 20px;">
        Salam,<br>
        <span style="color: #334155; font-weight: 600;">Dodolan Store</span>
    </p>

    <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
        <p style="margin: 0 0 6px 0; color: #94a3b8; font-size: 12px; line-height: 18px;">
            Jika tombol di atas tidak dapat diklik, salin tautan berikut ke peramban Anda:
        </p>
        <p style="margin: 0; word-break: break-all; font-size: 12px; line-height: 18px;">
            <a href="{{ $url }}" style="color: #059669; text-decoration: underline;">{{ $url }}</a>
        </p>
    </div>
@endsection
