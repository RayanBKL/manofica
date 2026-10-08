// demo.tsx
import React from 'react';
import MasonryGrid from '@/components/ui/masonry-grid';

// Sample data for the demo
const galleryItems = [
  { id: 1, src: '/assets/images/real_gallery/pizza-manofica.jpg', alt: 'Pizza artisanale Manofica' },
  { id: 2, src: '/assets/images/real_gallery/la-pizza-manofica.jpg', alt: 'Pâte napolitaine alvéolée' },
  { id: 3, src: '/assets/images/real_gallery/le-dessert.jpg', alt: 'Tiramisu signature' },
  { id: 4, src: '/assets/images/real_gallery/manofica.jpg', alt: 'Ambiance de salle' },
  { id: 5, src: '/assets/images/real_gallery/manofica (1).jpg', alt: 'Terrasse sur le port' },
  { id: 6, src: '/assets/images/real_gallery/caption (1).jpg', alt: 'Cocktail & antipasti' },
  { id: 7, src: '/assets/images/real_gallery/caption (2).jpg', alt: 'Détails du bar en zellige' },
  { id: 8, src: '/assets/images/real_gallery/caption (3).jpg', alt: 'Four à pizza' },
  { id: 9, src: '/assets/images/real_gallery/caption (4).jpg', alt: 'Plats frais du jour' },
  { id: 10, src: '/assets/images/real_gallery/caption (5).jpg', alt: 'Service & convivialité' },
  { id: 11, src: '/assets/images/real_gallery/l-italie-au-porte-de.jpg', alt: 'Saveurs méditerranéennes' },
  { id: 12, src: '/assets/images/real_gallery/20190904-214040-largejpg.jpg', alt: 'Soirée à Toulon' }
];

const MasonryGridDemo = () => {
  return (
    <div className="w-full min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-serif text-foreground mb-2">
            La Galerie Manofica
          </h1>
          <p className="text-lg text-muted-foreground">
            L'authenticité italienne sur le port de Toulon
          </p>
        </div>

        <MasonryGrid
          items={galleryItems}
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
          gap="1.25rem"
          renderItem={(item) => (
            <div className="overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 ease-out bg-card group">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default MasonryGridDemo;
