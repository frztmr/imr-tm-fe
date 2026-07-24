import * as Accordion from "@radix-ui/react-accordion";

export const AnimatedAccordion = () => {
  return (
    <Accordion.Root type="single" collapsible className="w-full">
      <Accordion.Item
        value="item-1"
        className="rounded-2xl shadow-md border bg-white overflow-hidden"
      >
        <Accordion.Header>
          <Accordion.Trigger className="w-full px-4 py-3 text-left font-medium">
            Accordion Title
          </Accordion.Trigger>
        </Accordion.Header>

        <Accordion.Content
          className={`
            data-[state=open]:animate-accordion-down
            data-[state=closed]:animate-accordion-up
            overflow-hidden
          `}
        >
          {/* This inner card will fade */}
          <div
            className={`
              fade-in-card opacity-0
              data-[state=open]:animate-fade-in
              data-[state=open]:animation-delay-[1s]
              data-[state=closed]:animate-fade-out
              data-[state=closed]:animation-delay-[0s]
              transition-opacity duration-500
              p-4
            `}
          >
            <div className="rounded-xl shadow-sm bg-gray-50 p-4">
              Card content here
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};
