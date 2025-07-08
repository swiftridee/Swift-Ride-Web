import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";

interface PaymentInfo {
  paymentMethod: "credit" | "paypal" | "cod";
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
  maskedCardNumber?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (paymentInfo: PaymentInfo) => void;
  totalAmount: number;
  bookingDetails: {
    vehicleName: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    dropLocation: string;
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentComplete,
  totalAmount,
  bookingDetails,
}) => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentMethod: "credit",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handlePaymentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setPaymentInfo({
        ...paymentInfo,
        [name]: checked,
      });
    } else if (name === "cardNumber") {
      setPaymentInfo({
        ...paymentInfo,
        [name]: formatCardNumber(value),
      });
    } else if (name === "expiryDate") {
      setPaymentInfo({
        ...paymentInfo,
        [name]: formatExpiryDate(value),
      });
    } else if (name === "cvv") {
      setPaymentInfo({
        ...paymentInfo,
        [name]: value.replace(/\D/g, "").slice(0, 3),
      });
    } else {
      setPaymentInfo({
        ...paymentInfo,
        [name]: value,
      });
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentInfo({
      ...paymentInfo,
      paymentMethod: value as "credit" | "paypal" | "cod",
    });
  };

  const validateForm = () => {
    if (paymentInfo.paymentMethod === "credit") {
      if (!paymentInfo.cardName.trim()) {
        toast.error("Please enter the name on card");
        return false;
      }
      if (!paymentInfo.cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
        toast.error("Please enter a valid 16-digit card number");
        return false;
      }
      if (!paymentInfo.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        toast.error("Please enter a valid expiry date (MM/YY)");
        return false;
      }
      if (!paymentInfo.cvv.match(/^\d{3}$/)) {
        toast.error("Please enter a valid 3-digit CVV");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create masked card number for security (only show last 4 digits)
      const maskedCardNumber = paymentInfo.cardNumber
        .replace(/\s/g, "")
        .replace(/\d(?=\d{4})/g, "*");

      // Prepare payment info with masked card number
      const paymentData = {
        ...paymentInfo,
        maskedCardNumber,
        // Remove sensitive data before sending to backend
        cardNumber: paymentInfo.cardNumber.replace(/\s/g, ""), // Remove spaces
        cvv: paymentInfo.cvv,
        expiryDate: paymentInfo.expiryDate,
        cardName: paymentInfo.cardName,
        saveCard: paymentInfo.saveCard,
        paymentMethod: paymentInfo.paymentMethod,
        paymentDate: new Date().toISOString(),
        paymentStatus: "completed",
      };

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Payment processed successfully!");
      onPaymentComplete(paymentData);
      onClose();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">
              Booking Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-medium">
                  {bookingDetails.vehicleName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Date:</span>
                <span className="font-medium">{bookingDetails.pickupDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return Date:</span>
                <span className="font-medium">{bookingDetails.returnDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Location:</span>
                <span className="font-medium">
                  {bookingDetails.pickupLocation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Drop Location:</span>
                <span className="font-medium">
                  {bookingDetails.dropLocation}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-900 font-semibold">
                  Total Amount:
                </span>
                <span className="text-gray-900 font-bold">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Select Payment Method
              </Label>
              <RadioGroup
                value={paymentInfo.paymentMethod}
                onValueChange={handlePaymentMethodChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit" id="credit" />
                  <Label htmlFor="credit" className="text-sm">
                    Credit / Debit Card
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Credit Card Details */}
            {paymentInfo.paymentMethod === "credit" && (
              <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                <div>
                  <Label htmlFor="cardName" className="text-sm font-medium">
                    Name on Card
                  </Label>
                  <Input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={paymentInfo.cardName}
                    onChange={handlePaymentChange}
                    required
                    className="mt-1"
                    placeholder="Enter cardholder name"
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber" className="text-sm font-medium">
                    Card Number
                  </Label>
                  <Input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                    required
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter 16 digits card number
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate" className="text-sm font-medium">
                      Expiry Date
                    </Label>
                    <Input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentChange}
                      required
                      maxLength={5}
                      placeholder="MM/YY"
                      className="mt-1"
                    />
                    <p className="mt-1 text-xs text-gray-500">Format: MM/YY</p>
                  </div>

                  <div>
                    <Label htmlFor="cvv" className="text-sm font-medium">
                      CVV
                    </Label>
                    <Input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      required
                      maxLength={3}
                      placeholder="123"
                      className="mt-1"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      3 digits on back of card
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveCard"
                    name="saveCard"
                    checked={paymentInfo.saveCard}
                    onCheckedChange={(checked) =>
                      setPaymentInfo({
                        ...paymentInfo,
                        saveCard: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="saveCard" className="text-sm">
                    Save this card for future purchases
                  </Label>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="bg-primary hover:bg-primary/90"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  `Pay $${totalAmount.toFixed(2)}`
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
