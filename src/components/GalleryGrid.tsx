
interface GalleryGridProps {
  images: { src: string; alt?: string }[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {images.map((img, idx) => (
        <div key={img.src + idx} className="overflow-hidden rounded-xl shadow-md hover:scale-105 transition-transform duration-300 bg-white">
          <img src={img.src} alt={img.alt || "Photo studio"} className="object-cover w-full h-64" />
        </div>
      ))}
    </div>
  );
}
