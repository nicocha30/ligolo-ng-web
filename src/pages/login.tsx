import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, Button, Divider, Form, Input } from "@heroui/react";
import { Logo } from "@/components/icons.tsx";
import { ThemeSwitch } from "@/components/theme-switch.tsx";
import { useAuth } from "@/authprovider.tsx";

export default function LoginPage() {
  const auth = useAuth();

  const [apiUrl, setApiUrl] = useState(auth?.api || "http://127.0.0.1:8080");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    auth?.loginApi(apiUrl, login, password);
  };

  useEffect(() => {
    if (!auth?.errorText) return;

    setLoading(false);
    setError(auth.errorText);
  }, [auth?.errorText]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <Logo size={60} />
          <p className="font-bold text-inherit">Ligolo-ng</p>
          <ThemeSwitch />
          <Divider className={"m-3"} />
          <p className="text-small text-default-500">
            Log in to your account to continue
          </p>
        </div>
        <Form
          className="flex flex-col gap-3"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            label="API URL"
            name="api_url"
            placeholder="http://127.0.0.1:8080"
            type="text"
            variant="bordered"
            value={apiUrl}
            onValueChange={setApiUrl}
          />
          <Input
            isRequired
            label="Username"
            name="username"
            placeholder="Enter your username"
            type="text"
            variant="bordered"
            onValueChange={setLogin}
          />
          <Input
            isRequired
            label="Password"
            name="password"
            placeholder="Enter your password"
            type={"password"}
            variant="bordered"
            onValueChange={setPassword}
          />
          {error && <Alert color={"warning"} title={error} description={""} />}

          <Button className="w-full" color="primary" type="submit">
            {loading ? "Authenticating..." : "Authenticate"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
