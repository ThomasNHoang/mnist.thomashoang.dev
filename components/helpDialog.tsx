import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

type helpItem = {
  title: string;
  content: string;
};

export function HelpDialog({
  trigger,
}: {
  trigger: React.ReactElement<typeof Button>;
}) {
  const helpItems: helpItem[] = [
    {
      title: "How do I improve recognition accuracy?",
      content:
        "Draw the digit clearly and avoid overlapping strokes. Center the digit in the drawing area.",
    },
    {
      title: "Which model is the most accurate?",
      content:
        "Based off our tests, Model 2 is the most accurate based off test data. Results can vary based on drawing.",
    },
    {
      title: "What digits are supported?",
      content: "This model supports recognition of digits from 0 to 9.",
    },
    {
      title: "Why is my digit not recognized correctly?",
      content:
        "Ensure your digit resembles standard handwritten digits. Avoid extra marks or unusual styles.",
    },
    {
      title: "What is the model's confidence score?",
      content:
        "The confidence score reflects how certain the model is about its prediction. A higher score means higher certainty.",
    },
    {
      title:
        "My drawing is perfect, but off-center, why am I getting bad results?",
      content:
        "The model was trained on centered digits. When the digit is off-center, the model may not recognize the patterns correctly, as it expects the digits to be in a specific region. Try centering the digit within the drawing area for better results.",
    },
    {
      title: "Why are there gaps in my drawing?",
      content:
        "You might be drawing too fast for the event listener. Try drawing slower.",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Help</DialogTitle>
          <DialogDescription>
            Follow these recommendations for optimal performance.
          </DialogDescription>
        </DialogHeader>
        <Accordion type="single" collapsible className="w-full">
          {helpItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
