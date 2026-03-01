import React from "react";
import SeatCard, { type SeatCardProps } from "./SeatCard";

interface SeatGridProps {
    seats: SeatCardProps[];
    onSeatClick?: (seatId: string) => void;
    onCancel?: (bookingId: string) => void;
    onCheckIn?: (bookingId: string) => void;
    isPendingAction?: boolean;
}

const SeatGrid: React.FC<SeatGridProps> = ({ seats, onSeatClick, onCancel, onCheckIn, isPendingAction }) => {
    return (
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mt-4">
            {seats.map((seat) => (
                <SeatCard
                    key={seat.seatId}
                    seatId={seat.seatId}
                    seatNumber={seat.seatNumber}
                    status={seat.status}
                    bookingId={seat.bookingId}
                    onClick={onSeatClick}
                    onCancel={seat.onCancel || onCancel}
                    onCheckIn={seat.onCheckIn || onCheckIn}
                    isPendingAction={isPendingAction || seat.isPendingAction}
                />
            ))}
        </div>
    );
};

export default SeatGrid;
