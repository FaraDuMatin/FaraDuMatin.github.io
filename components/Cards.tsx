import TiltedCard from "@/components/ui/TiltedCard";

interface Cards {
  imageSrc: React.ComponentProps<'img'>['src'];
  altText?: string;
  captionText?: string;
  title: string;
}

export default function Cards({ imageSrc, altText, captionText, title }: Cards) {
  return (
    <TiltedCard
      imageSrc={imageSrc}
      altText={altText}
      captionText={captionText}
      containerHeight="300px"
      containerWidth="300px"
      imageHeight="300px"
      imageWidth="300px"
      rotateAmplitude={12}
      scaleOnHover={1.05}
      showMobileWarning={false}
      showTooltip
      displayOverlayContent
      overlayContent={
        <p className=" mt-8 mx-5 w-fit rounded-2xl bg-linear-to-r from-zinc-700 to-zinc-500 px-4 py-3 font-black text-white shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
          {title}
        </p>
      }
    />
  );
}
