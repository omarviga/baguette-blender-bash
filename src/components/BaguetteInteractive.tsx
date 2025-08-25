import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import panArribaImg from '@/assets/pan-arriba.png';
import panAbajoImg from '@/assets/pan-abajo.png';
import polloBBQImg from '@/assets/pollo-bbq.png';
import quesoImg from '@/assets/queso.png';
import lechugaImg from '@/assets/lechuga.png';
import tomateImg from '@/assets/tomate.png';

interface Ingredient {
  id: string;
  name: string;
  image: string;
  description: string;
  color: string;
  initialDelay: number;
}

const ingredients: Ingredient[] = [
  {
    id: 'pan-arriba',
    name: 'Pan Baguette Superior',
    image: panArribaImg,
    description: 'Pan dorado y crujiente por fuera, suave por dentro',
    color: 'bread',
    initialDelay: 0
  },
  {
    id: 'tomate',
    name: 'Tomate Fresco',
    image: tomateImg,
    description: 'Rodajas jugosas de tomate maduro',
    color: 'tomato',
    initialDelay: 100
  },
  {
    id: 'lechuga',
    name: 'Lechuga Iceberg',
    image: lechugaImg,
    description: 'Hojas frescas y crujientes',
    color: 'lettuce',
    initialDelay: 200
  },
  {
    id: 'queso',
    name: 'Queso Cheddar',
    image: quesoImg,
    description: 'Queso cremoso y derretido',
    color: 'cheese',
    initialDelay: 300
  },
  {
    id: 'pollo-bbq',
    name: 'Pollo BBQ',
    image: polloBBQImg,
    description: 'Pechuga de pollo a la parrilla con salsa BBQ',
    color: 'chicken',
    initialDelay: 400
  },
  {
    id: 'pan-abajo',
    name: 'Pan Baguette Base',
    image: panAbajoImg,
    description: 'Base crujiente del baguette',
    color: 'bread',
    initialDelay: 500
  }
];

export default function BaguetteInteractive() {
  const [isExploded, setIsExploded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
  const explodeSoundRef = useRef<HTMLAudioElement>(null);
  const collapseSoundRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Trigger initial animation
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const playSound = (soundRef: React.RefObject<HTMLAudioElement>) => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {
        // Ignore if audio can't play (user hasn't interacted yet)
      });
    }
  };

  const toggleBaguette = () => {
    if (isExploded) {
      playSound(collapseSoundRef);
    } else {
      playSound(explodeSoundRef);
    }
    setIsExploded(!isExploded);
  };

  return (
    <main className="min-h-screen bg-gradient-warm flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8 animate-bounce-in">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
          🥖 Baguette BBQ Interactivo
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-6">
          ¡Haz clic en el baguette o usa el botón para ver la magia de los ingredientes!
        </p>
        <Button 
          onClick={toggleBaguette}
          variant="default"
          size="lg"
          className="bg-gradient-hero shadow-hero hover:shadow-ingredient transition-all duration-300 text-lg px-8 py-3"
        >
          {isExploded ? '🥪 Armar Baguette' : '💥 Explotar Ingredientes'}
        </Button>
      </div>

      <Card className="relative p-8 bg-card/80 backdrop-blur-sm shadow-hero border-2 border-border">
        <div 
          className="relative w-[90vw] max-w-2xl h-96 mx-auto cursor-pointer transition-all duration-300 hover:scale-105"
          onClick={toggleBaguette}
          style={{ perspective: '1000px' }}
        >
          {ingredients.map((ingredient, index) => {
            const explodeDistance = isExploded 
              ? index === 0 ? -120 
              : index === 1 ? -80
              : index === 2 ? -40
              : index === 3 ? 40
              : index === 4 ? 80
              : 120
              : 0;

            return (
              <div
                key={ingredient.id}
                className={`absolute inset-0 transition-all duration-700 ${
                  isLoaded ? 'animate-float-up' : 'opacity-0'
                }`}
                style={{
                  transform: `translateY(${explodeDistance}px) ${isExploded ? 'scale(1.05)' : 'scale(1)'}`,
                  zIndex: ingredients.length - index,
                  animationDelay: `${ingredient.initialDelay}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                }}
                onMouseEnter={() => setHoveredIngredient(ingredient.id)}
                onMouseLeave={() => setHoveredIngredient(null)}
              >
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className={`w-full h-auto object-contain transition-all duration-300 ${
                    hoveredIngredient === ingredient.id ? 'brightness-110 shadow-ingredient' : ''
                  }`}
                  draggable={false}
                />
                
                {/* Tooltip on hover */}
                {hoveredIngredient === ingredient.id && isExploded && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 animate-bounce-in">
                    <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-ingredient text-sm font-medium whitespace-nowrap border">
                      <div className="font-semibold">{ingredient.name}</div>
                      <div className="text-xs text-muted-foreground">{ingredient.description}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {isExploded 
              ? "🔍 Pasa el ratón sobre cada ingrediente para ver más detalles" 
              : "🖱️ Haz clic en el baguette para separar los ingredientes"
            }
          </p>
        </div>
      </Card>

      {/* Ingredients list when exploded */}
      {isExploded && (
        <Card className="mt-8 p-6 bg-card/90 backdrop-blur-sm max-w-2xl w-full animate-bounce-in">
          <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
            🍽️ Ingredientes del Baguette BBQ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ingredients.map((ingredient) => (
              <div 
                key={ingredient.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors duration-200"
              >
                <div className={`w-3 h-3 rounded-full bg-${ingredient.color}`}></div>
                <div>
                  <div className="font-medium text-foreground">{ingredient.name}</div>
                  <div className="text-xs text-muted-foreground">{ingredient.description}</div>
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <p className="text-center text-sm text-muted-foreground">
            ✨ ¡Un baguette delicioso con ingredientes frescos y de calidad!
          </p>
        </Card>
      )}

      {/* Hidden audio elements for sound effects */}
      <audio 
        ref={explodeSoundRef} 
        preload="auto"
      >
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmBdEkKU3PbdfSwGVpHy8tuXHhEZfrPOp2kmBAA=" type="audio/wav" />
      </audio>
      <audio 
        ref={collapseSoundRef} 
        preload="auto"
      >
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAqBlrxbh4OKNwcBjuL2O7UGgcEVoLq6ZdQEQpAldbgsm8pAjR8yO" type="audio/wav" />
      </audio>
    </main>
  );
}