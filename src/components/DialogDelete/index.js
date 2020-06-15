import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

export default function DialogDelete({ open, handleClose, confirm, children }) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {children}
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Desistir
                </Button>
                <Button onClick={confirm} color="primary" autoFocus>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
