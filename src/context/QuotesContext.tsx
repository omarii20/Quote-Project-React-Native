import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getQuotes,
  type Quote,
} from '../api/quotesApi';

type QuotesContextType = {
  quotes: Quote[];
  loading: boolean;
  error: string;

  refreshQuotes: () => Promise<void>;

  addQuote: (quote: Quote) => void;
  updateQuote: (quote: Quote) => void;
  removeQuote: (quoteId: number) => void;
};

const QuotesContext =
  createContext<QuotesContextType | undefined>(
    undefined,
  );

type Props = {
  children: React.ReactNode;
};

export function QuotesProvider({
  children,
}: Props) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getQuotes();

      setQuotes(data);
    } catch (err) {
      console.log('Load quotes error:', err);

      setError(
        'לא הצלחנו לטעון את הצעות המחיר.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshQuotes();
  }, [refreshQuotes]);

  const addQuote = (quote: Quote) => {
    setQuotes(currentQuotes => [
      quote,
      ...currentQuotes,
    ]);
  };

  const updateQuote = (quote: Quote) => {
    setQuotes(currentQuotes =>
      currentQuotes.map(currentQuote =>
        currentQuote.id === quote.id
          ? quote
          : currentQuote,
      ),
    );
  };

  const removeQuote = (
    quoteId: number,
  ) => {
    setQuotes(currentQuotes =>
      currentQuotes.filter(
        quote => quote.id !== quoteId,
      ),
    );
  };

  return (
    <QuotesContext.Provider
      value={{
        quotes,
        loading,
        error,
        refreshQuotes,
        addQuote,
        updateQuote,
        removeQuote,
      }}>
      {children}
    </QuotesContext.Provider>
  );
}

export function useQuotes() {
  const context =
    useContext(QuotesContext);

  if (!context) {
    throw new Error(
      'useQuotes must be used inside QuotesProvider',
    );
  }

  return context;
}