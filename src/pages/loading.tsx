import { ThemeSwitch } from "@/components/theme-switch.tsx";
import { Card, Progress } from "@heroui/react";
import { Logo } from "@/components/icons.tsx";

export default function LoadingPage() {
  return (
    <div className="h-[100vh] flex items-center">
      <div className="absolute top-0 right-0 p-4">
        <ThemeSwitch />
      </div>
      <Card className="w-[600px] flex m-auto p-6 !transition-none">
        <div className="inline-flex items-center gap-1 justify-left">
          <Logo size={60} />
          <p className="font-bold text-inherit font-[600]">Ligolo-ng</p>
        </div>
        <div className="mt-6">
          <Progress
            classNames={{
              track: "drop-shadow-md border border-default",
              indicator: "bg-gradient-to-r from-red-500 to-red-800",
              label: "tracking-wider font-medium text-default-600",
              value: "text-foreground/60",
            }}
            radius="sm"
            size="sm"
            value={100}
          />
        </div>
      </Card>
    </div>
  );
}
