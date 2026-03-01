import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

interface DeleteConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    loading?: boolean;
}

/**
 * A reusable confirmation dialog for delete actions.
 */
const DeleteConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
    loading = false,
}: DeleteConfirmDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
        >
            <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 600 }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-dialog-description">
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={loading} sx={{ textTransform: "none" }}>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    color="error"
                    variant="contained"
                    disableElevation
                    disabled={loading}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmDialog;
