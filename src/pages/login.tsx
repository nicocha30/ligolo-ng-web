import * as React from "react";
import { useCallback, useContext, useState } from "react";
import { Logo } from "@/components/icons.tsx";
import { ThemeSwitch } from "@/components/theme-switch.tsx";
import { useAuth } from "@/authprovider.tsx";
import ErrorContext from "@/contexts/Error.tsx";
import {
  Button,
  Card,
  Form,
  Input,
  CircularProgress,
  Alert,
} from "@heroui/react";

const defaultApiUrl = import.meta.env["VITE_DEFAULT_API_URL"];

export default function LoginPage() {
  const auth = useAuth();

  const [apiUrl, setApiUrl] = useState(auth?.api || defaultApiUrl);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setError } = useContext(ErrorContext);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      try {
        await auth?.loginApi(apiUrl, login, password);
      } catch (error) {
        setError(error);
      }

      setLoading(false);
    },
    [auth, apiUrl, login, password, setError],
  );

  return (
    <div className="h-[100vh] flex items-center">
      <div className="absolute top-0 right-0 p-4">
        <ThemeSwitch />
      </div>
      <div className="flex flex-col w-full justify-center">
        <div className="inline-flex items-center gap-1 justify-center mb-2">
          <Logo size={50} />
          <p className="font-bold text-inherit">Ligolo-ng</p>
        </div>
        <div className="w-[600px] mx-auto my-4 flex items-center justify-center w-full px-2">
          <Alert
            variant="flat"
            color="warning"
            title="Log in to your account to continue"
          />
        </div>
        <Card className="w-[600px] flex m-auto p-6">
          <Form validationBehavior="native" onSubmit={handleSubmit}>
            <Input
              size="sm"
              placeholder="Username"
              name="username"
              labelPlacement="outside"
              isRequired
              value={login}
              onValueChange={setLogin}
            />
            <Input
              size="sm"
              labelPlacement="outside"
              isRequired
              placeholder="Enter your password"
              value={password}
              type="password"
              onValueChange={setPassword}
            />
            <Input
              size="sm"
              placeholder="API URL"
              labelPlacement="outside"
              isRequired
              value={apiUrl}
              onValueChange={setApiUrl}
              name="api_url"
            />
            <Button
              className="mt-2 w-full gap-0 text-opacity-50"
              size="sm"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress className="scale-50" color="default" />
                  Authenticating
                </>
              ) : (
                "Authenticate"
              )}
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}
