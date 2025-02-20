import {
  Component,
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { AppError, UnknownAppError } from "@/errors";
import ErrorPage from "@/pages/error.tsx";

export interface IErrorContext {
  error?: AppError | unknown;
  setError: Dispatch<AppError | unknown>;
}

const ErrorContext = createContext<IErrorContext>({
  error: undefined,
  setError: () => undefined,
});

interface IErrorBoundaryProps {
  children: ReactNode;
}
export class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  { hasError: boolean; error: unknown }
> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: AppError | unknown) {
    return { hasError: true, error };
  }

  render() {
    return this.state.hasError ? (
      <ErrorPage
        error={
          this.state.error instanceof AppError
            ? this.state.error
            : UnknownAppError.fromError(this.state.error)
        }
      />
    ) : (
      this.props.children
    );
  }
}

interface IErrorWrapperProps {
  children: ReactNode;
}

export const ErrorWrapper = ({ children }: IErrorWrapperProps) => {
  const [error, setError] = useState<AppError>();

  useEffect(() => {
    if (!error) return;

    error.toast();
    setError(undefined);
  }, [error, setError]);

  return (
    <ErrorBoundary>
      <ErrorContext.Provider value={{ error, setError }}>
        {children}
      </ErrorContext.Provider>
    </ErrorBoundary>
  );
};

export default ErrorContext;
