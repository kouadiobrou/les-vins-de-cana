import { useState } from 'react';
import axios from 'axios';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  const initiatePayment = async (provider, phoneNumber) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Initiating payment request...');
      const response = await axios.post('/api/payments/initiate', {
        provider,
        phoneNumber
      });

      console.log('Payment response received:', response.data);
      const data = response.data;
      
      if (!data || !data.paymentId) {
        throw new Error('Invalid response format');
      }

      setPaymentId(data.paymentId);
      setPaymentStatus(data.status);
      return data;
    } catch (err) {
      console.error('Payment initiation error:', err);
      setError('Payment initiation failed');
      setPaymentStatus('failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentId) {
      setError('No payment ID available');
      setPaymentStatus('failed');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Checking payment status...');
      const response = await axios.get(`/api/payments/status/${paymentId}`);
      console.log('Status response received:', response.data);
      
      const data = response.data;
      if (!data || !data.status) {
        throw new Error('Invalid response format');
      }

      setPaymentStatus(data.status);
      return data.status;
    } catch (err) {
      console.error('Status check error:', err);
      setError('Status check failed');
      setPaymentStatus('failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    paymentStatus,
    paymentId,
    initiatePayment,
    checkPaymentStatus
  };
};

export default usePayment;
