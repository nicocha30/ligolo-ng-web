import { ChevronRight, MoveLeft } from "lucide-react";
import { AppError, HttpError } from "@/errors/index.tsx";
import { Button } from "@heroui/react";
import { Accordion, AccordionItem } from "@heroui/react";

const isDebugEnabled = import.meta.env["VITE_ENABLE_ERROR_DEBUG"] === "true";
const ErrorPage = ({ error }: { error: AppError | HttpError }) => (
  <div className="w-full h-screen flex flex-col items-center justify-center">
    <div className="w-full flex flex-1 items-center justify-center flex-col">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-3xl font-semibold tracking-tight">{error.name}</h3>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <a className="mt-4" href="/">
          <Button>
            <MoveLeft className="mr-2 h-4 w-4" /> Back home
          </Button>
        </a>
      </div>
      <div className="mt-6 flex items-center justify-stretch w-full max-w-[1000px] mx-8">
        {isDebugEnabled && (
          <Accordion
            defaultExpandedKeys={["1"]}
            className="w-full block"
            variant="splitted"
            isCompact
          >
            <AccordionItem
              className="bg-danger bg-opacity-10"
              title={
                <p className="text-danger flex items-center gap-2">
                  {error.name}
                </p>
              }
              subtitle={
                <p className="text-danger font-thin flex items-center gap-2">
                  <ChevronRight size={15} />
                  Open stacktrace
                </p>
              }
              key="1"
            >
              <p className="text-sm p-2 pt-0 opacity-75 font-thin">
                {error.stack}
              </p>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  </div>
);

export default ErrorPage;
