import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import QRCode from 'qrcode.react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const StatusCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3)
}));

const QRCodeContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  '& canvas': {
    maxWidth: '100%',
    height: 'auto'
  }
}));

const USSDCode = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const PaymentStatus = ({ 
  status, 
  paymentDetails, 
  onClose,
  onRetry 
}) => {
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    let timer;
    if (copied) {
      timer = setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopyUSSD = () => {
    navigator.clipboard.writeText(paymentDetails.ussdCode);
    setCopied(true);
  };

  const renderStatus = () => {
    switch (status) {
      case 'pending':
        return (
          <>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Paiement en cours
            </Typography>
            <Typography color="text.secondary">
              Veuillez suivre les instructions pour compléter votre paiement
            </Typography>
          </>
        );

      case 'completed':
        return (
          <>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Paiement réussi
            </Typography>
            <Typography color="text.secondary">
              Votre paiement a été confirmé. Vous allez recevoir un email de confirmation.
            </Typography>
          </>
        );

      case 'failed':
        return (
          <>
            <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Échec du paiement
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Une erreur est survenue lors du traitement de votre paiement.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={onRetry}
              sx={{ mt: 2 }}
            >
              Réessayer
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <StatusCard>
        {renderStatus()}

        {status === 'pending' && paymentDetails && (
          <Box sx={{ mt: 3 }}>
            {paymentDetails.qrCode && (
              <QRCodeContainer>
                <Typography variant="subtitle1" gutterBottom>
                  Scannez le QR code avec votre application Wave
                </Typography>
                <QRCode value={paymentDetails.paymentUrl} size={200} />
              </QRCodeContainer>
            )}

            {paymentDetails.ussdCode && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Ou composez le code USSD suivant
                </Typography>
                <USSDCode>
                  <Typography variant="h6" component="span">
                    {paymentDetails.ussdCode}
                  </Typography>
                  <Button
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyUSSD}
                    color={copied ? 'success' : 'primary'}
                  >
                    {copied ? 'Copié !' : 'Copier'}
                  </Button>
                </USSDCode>
              </Box>
            )}

            <Button
              variant="text"
              color="primary"
              onClick={() => setShowInstructions(true)}
              sx={{ mt: 2 }}
            >
              Voir les instructions détaillées
            </Button>
          </Box>
        )}
      </StatusCard>

      <Dialog
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Instructions de paiement
          </Typography>
          <Typography variant="body1" paragraph>
            1. Ouvrez votre application mobile money
          </Typography>
          <Typography variant="body1" paragraph>
            2. Sélectionnez "Payer" ou "Scanner"
          </Typography>
          <Typography variant="body1" paragraph>
            3. Scannez le QR code ou composez le code USSD
          </Typography>
          <Typography variant="body1" paragraph>
            4. Confirmez le montant et validez le paiement
          </Typography>
          <Typography variant="body1">
            5. Entrez votre code PIN pour confirmer
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInstructions(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentStatus;
