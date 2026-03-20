<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyEmailCode extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $code,
        public string $userName,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'รหัสยืนยันอีเมล - Badminton Party',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.verify-email-code',
        );
    }
}
