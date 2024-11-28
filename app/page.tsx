import { H1, P } from "@/components/typography";
import { Interface } from "@/components/interface";

export default function Home() {
  return (
    <div className="p-10">
      <H1>Black and White MNIST Neural Network</H1>
      <P>
        A Multi Layer Perceptron (MLP) neural network digit recognizer trained
        on the Modified National Institute of Standards and Technology (MNIST)
        dataset.
      </P>
      <Interface />
    </div>
  );
}
