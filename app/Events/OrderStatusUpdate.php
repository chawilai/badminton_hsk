<?php

namespace App\Events;

use App\Models\Game;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdate implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */

    public $game;

    public function __construct(Game $game)
    {
        $this->game = $game;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('lobby'), // Use Channel instead if no authentication is needed
        ];
    }

    /**
     * Get the data to broadcast.
     */
    // public function broadcastWith(): array
    // {
    //     return [
    //         'game' => $this->game->toArray(), // Ensure Game model has serializable data
    //     ];
    // }

    public function broadcastAs()
    {
        return 'OrderStatusUpdate';
    }
}
