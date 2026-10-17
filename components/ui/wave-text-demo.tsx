import { WaveText } from "@/components/ui/wave-text";

export default function WaveTextDemo() {
  return (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center bg-background p-10">
      <WaveText
        as="h2"
        className="text-5xl font-semibold tracking-tight text-foreground"
        repeat
      >
        High tide
      </WaveText>
    </div>
  );
}
