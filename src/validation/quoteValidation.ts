import type {PricingMethod} from '../screens/quotes/QuoteDetailsForm';
import type {QuoteItemFormData} from '../screens/quotes/QuotePricingForm';
import type {DiscountType} from '../screens/quotes/QuoteTotalsForm';

type ValidateQuoteParams = {
  customerId: number | null;

  pricingMethod: PricingMethod;

  items: QuoteItemFormData[];

  additionalAmount: string;

  manualSubtotal: string;

  discountType: DiscountType;

  discountValue: string;

  vatRate: string;
};

export type QuoteValidationResult = {
  isValid: boolean;
  error: string;
};

export const validateQuote = ({
  customerId,
  pricingMethod,
  items,
  additionalAmount,
  manualSubtotal,
  discountType,
  discountValue,
  vatRate,
}: ValidateQuoteParams): QuoteValidationResult => {
  if (!customerId) {
    return {
      isValid: false,
      error: 'יש לבחור לקוח.',
    };
  }

  if (pricingMethod === 'items') {
    if (items.length === 0) {
      return {
        isValid: false,
        error: 'יש להוסיף לפחות פריט אחד.',
      };
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.description.trim()) {
        return {
          isValid: false,
          error: `יש להזין תיאור לפריט ${i + 1}.`,
        };
      }

      const quantity = Number(item.quantity);

      if (
        item.quantity.trim() === '' ||
        !Number.isFinite(quantity) ||
        quantity <= 0
      ) {
        return {
          isValid: false,
          error: `הכמות בפריט ${i + 1} חייבת להיות גדולה מ־0.`,
        };
      }

      const unitPrice = Number(item.unitPrice);

      if (
        item.unitPrice.trim() === '' ||
        !Number.isFinite(unitPrice) ||
        unitPrice < 0
      ) {
        return {
          isValid: false,
          error: `מחיר היחידה בפריט ${i + 1} אינו תקין.`,
        };
      }
    }

    if (additionalAmount.trim() !== '') {
      const additional = Number(additionalAmount);

      if (
        !Number.isFinite(additional) ||
        additional < 0
      ) {
        return {
          isValid: false,
          error: 'הסכום הנוסף אינו תקין.',
        };
      }
    }
  }

  if (pricingMethod === 'manual') {
    const manual = Number(manualSubtotal);

    if (
      manualSubtotal.trim() === '' ||
      !Number.isFinite(manual) ||
      manual < 0
    ) {
      return {
        isValid: false,
        error: 'יש להזין סכום ידני תקין.',
      };
    }
  }

  if (discountType !== 'none') {
    const discount = Number(discountValue);

    if (
      discountValue.trim() === '' ||
      !Number.isFinite(discount) ||
      discount < 0
    ) {
      return {
        isValid: false,
        error: 'ערך ההנחה אינו תקין.',
      };
    }

    if (
      discountType === 'percent' &&
      discount > 100
    ) {
      return {
        isValid: false,
        error: 'אחוז ההנחה לא יכול להיות גדול מ־100%.',
      };
    }
  }

  const vat = Number(vatRate);

  if (
    vatRate.trim() === '' ||
    !Number.isFinite(vat) ||
    vat < 0
  ) {
    return {
      isValid: false,
      error: 'אחוז המע״מ אינו תקין.',
    };
  }

  return {
    isValid: true,
    error: '',
  };
};