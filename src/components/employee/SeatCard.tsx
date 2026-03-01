import React from "react";

export interface SeatCardProps {
    seatId: string;
    seatNumber: string;
    status: "available" | "booked" | "mine" | "checked_in" | "expired";
    bookingId?: string;
    onClick?: (seatId: string) => void;
    onCancel?: (bookingId: string) => void;
    onCheckIn?: (bookingId: string) => void;
    isPendingAction?: boolean;
}

const colorMap = {
    available: {
        wrapper: "border-green-500 bg-transparent hover:bg-green-50 cursor-pointer",
        text: "text-inherit",
        label: null,
    },
    booked: {
        wrapper: "border-gray-200 bg-gray-100 cursor-not-allowed",
        text: "text-gray-400",
        label: null,
    },
    mine: {
        wrapper: "border-blue-500 bg-blue-600 cursor-default",
        text: "text-white",
        label: "Your Seat",
    },
    checked_in: {
        wrapper: "border-blue-800 bg-blue-800 cursor-default",
        text: "text-white",
        label: "Checked-in",
    },
    expired: {
        wrapper: "border-red-400 bg-red-50 cursor-default",
        text: "text-red-600",
        label: null,
    },
} as const;

const SeatCard = React.memo(({ seatId, seatNumber, status, onClick, onCancel, onCheckIn, bookingId, isPendingAction }: SeatCardProps) => {
    const theme = colorMap[status];

    const handleClick = () => {
        if (status === "available" && onClick) {
            onClick(seatId);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`
                relative flex h-24 flex-col items-center justify-center rounded-xl border-2 transition-colors
                ${theme.wrapper}
            `}
        >
            <span className={`text-xl font-bold ${theme.text} ${(status === "mine" && (onCancel || onCheckIn)) ? "mb-3" : ""}`}>
                {seatNumber}
            </span>
            
            {/* Show buttons if handlers provided and status is mine, else show simple label */}
            {(status === "mine" && (onCancel || onCheckIn)) ? (
                <div className="absolute bottom-1.5 flex gap-1.5 w-full justify-center px-1">
                    {onCheckIn && (
                        <button
                            onClick={(e) => { e.stopPropagation(); bookingId && onCheckIn(bookingId); }}
                            disabled={isPendingAction}
                            className="rounded bg-white/20 px-2 flex-1 py-1 text-[10px] uppercase font-bold text-white hover:bg-white/30 disabled:opacity-50 transition-colors"
                        >
                            Check-in
                        </button>
                    )}
                    {onCancel && (
                        <button
                            onClick={(e) => { e.stopPropagation(); bookingId && onCancel(bookingId); }}
                            disabled={isPendingAction}
                            className="rounded bg-red-400/80 px-2 flex-1 py-1 text-[10px] uppercase font-bold text-white hover:bg-red-400 disabled:opacity-50 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            ) : theme.label ? (
                <span className={`absolute bottom-2 text-[10px] font-semibold tracking-wide uppercase ${theme.text} opacity-90`}>
                    {theme.label}
                </span>
            ) : null}
        </div>
    );
});

SeatCard.displayName = "SeatCard";

export default SeatCard;
