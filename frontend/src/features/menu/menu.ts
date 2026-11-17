/**
 * La carta de RITO · Cocina Rooftop. Único sitio donde se tocan platos, textos y precios.
 *
 * Fuente: la carta en PDF del restaurante ("carta-rito-cocina.pdf", 8 páginas), copiada tal
 * cual. Solo se corrigieron erratas evidentes ("quedo colby jack" → "queso colby jack").
 * Las frases de cada sección son las de la propia carta.
 *
 * Fotos: las de la web oficial ritogastrobar.com (ver `features/media/media.ts`).
 * Modelos 3D: `modelo` apunta a un id de `features/modelos3d/modelos.ts`.
 */
import { fotoPexels, fotoWeb, referencias } from '@/features/media/media'

/** Un plato o bebida con precio único. */
export type Dish = {
  id: string
  name: string
  description?: string
  /** Pesos colombianos, sin formato. `null` = "Consultar". */
  price: number | null
  /** Precio dicho con palabras cuando hay varias opciones ("Pequeños $23.000 · Grandes $31.500"). */
  precioTexto?: string
  /** Elecciones o sabores. */
  opciones?: string[]
  /** Marcado con el sol en la carta: recomendación de la casa. */
  destacado?: boolean
  /** Id del modelo 3D, si lo tiene. */
  modelo?: string
  /** Foto real del plato (de la web oficial). */
  foto?: string
  alt?: string
  /** `true` si `foto` es de referencia (Pexels), no del plato de RITO. */
  referencia?: boolean
  notas?: string[]
}

/** Licor con precio por shot, media y botella. */
export type Licor = { name: string; shot?: number; media?: number; botella?: number }

export type Seccion =
  | {
      id: string
      titulo: string
      intro?: string
      tipo: 'platos'
      items: Dish[]
      pie?: string[]
    }
  | {
      id: string
      titulo: string
      intro?: string
      tipo: 'lista'
      /** Foto de referencia de la sección (se rellena sola desde `referencias`). */
      imagen?: string
      /** Encabezados de las columnas de precio, si hay más de una (Sencillo · Doble). */
      columnas?: string[]
      items: { name: string; detalle?: string; precios: (number | null)[] }[]
      pie?: string[]
    }
  | {
      id: string
      titulo: string
      intro?: string
      tipo: 'licores'
      imagen?: string
      items: Licor[]
      pie?: string[]
    }

export type Grupo = {
  id: string
  titulo: string
  frase: string
  imagen: string
  imagenAlt: string
  secciones: Seccion[]
}

const ACOMPANAMIENTOS = [
  'Puré de papa blanca',
  'Papa casco artesanal',
  'Papa francesa',
  'Papa criolla',
  'Arroz',
  'Ensalada de temporada',
]

const cartaBase: Grupo[] = [
  {
    id: 'cocina',
    titulo: 'Cocina',
    frase: 'El primer acto de este ritual culinario.',
    imagen: fotoWeb('cazuela-mariscos-terraza', 1600),
    imagenAlt: 'Cazuela de mariscos humeante con almejas y calamar, servida en la terraza.',
    secciones: [
      {
        id: 'entradas',
        titulo: 'Entradas individuales',
        intro: 'Pequeñas obras maestras que despiertan los sentidos.',
        tipo: 'platos',
        items: [
          {
            id: 'crema-trucha-pollo',
            name: 'Crema de trucha o pollo',
            description: 'Crema coronada con crutones y queso fundido.',
            price: 15000,
            opciones: ['Trucha', 'Pollo'],
          },
          {
            id: 'coctel-camaron',
            name: 'Cóctel de camarón',
            description:
              'Cóctel de camarón a base de yogur griego, salsa roja de la casa y plumitas de plátano.',
            price: 25000,
          },
        ],
      },
      {
        id: 'compartir',
        titulo: 'Entradas pa’ compartir',
        intro: 'Los mejores momentos se sirven en el centro. Comparte, disfruta y repite.',
        tipo: 'platos',
        items: [
          {
            id: 'papas-bacon',
            name: 'Papas bacon',
            description: 'Papitas con tocineta caramelizada, bañadas en salsa de queso amarillo.',
            price: 20000,
            destacado: true,
            opciones: ['Papa a la francesa o casco', 'Tocineta de res o de cerdo'],
            notas: ['Adición: pulled pork $5.000', 'Adición: birria $5.000'],
          },
          {
            id: 'chinchulines',
            name: 'Chinchulines de la casa',
            description:
              'Chunchullo crocante, acompañado de guacamole, chimichurri de la casa y papa criolla.',
            price: 22000,
          },
          {
            id: 'canastas-patacon',
            name: 'Canastas de patacón Rito',
            description:
              'Deliciosos patacones rellenos de chicharrón y guacamole, terminados con cebolla encurtida.',
            price: 23000,
            modelo: 'canastas-patacon',
          },
        ],
      },
      {
        id: 'carnes',
        titulo: 'Carnes',
        intro:
          'Ritual del fuego. La cumbre del ritual: creaciones que celebran la fusión entre sabor, técnica y pasión.',
        tipo: 'platos',
        items: [
          {
            id: 'rib-eye',
            name: 'Rib eye',
            description: 'Corte madurado, marmoleado y jugoso, proveniente del lomo alto de res.',
            price: 52000,
          },
          {
            id: 'baby-beef',
            name: 'Baby beef',
            description: 'Jugoso corte tierno de res madurado, proveniente del lomo fino.',
            price: 50000,
          },
          {
            id: 'filet-mignon',
            name: 'Lomo fino al filet mignon',
            description:
              'Corte de lomo fino madurado, bañado en salsa demiglace y envuelto en tocineta.',
            price: 54000,
          },
          {
            id: 'churrasco',
            name: 'Churrasco',
            description:
              'Corte mariposa madurado y parrillado, acompañado de chimichurri de la casa.',
            price: 45000,
            modelo: 'churrasco',
          },
          {
            id: 'new-york-steak',
            name: 'New York steak',
            description: 'Corte madurado proveniente de la parte media del lomo. 400 g.',
            price: 52000,
          },
          {
            id: 'punta-anca',
            name: 'Punta de anca',
            description: 'Corte madurado con capa de grasa y gran sabor. 350 g.',
            price: 52000,
          },
          {
            id: 'parrillada',
            name: 'Parrillada (para 2)',
            description:
              'Picada para compartir con pechuga de pollo, chatas de res, lomo de cerdo, chorizo parrillado, chicharrones crocantes y papa criolla, con salsa BBQ y salsa de la casa.',
            price: 54000,
            modelo: 'parrillada',
          },
        ],
        pie: [`Acompañamientos (elige 2): ${ACOMPANAMIENTOS.join(', ')}.`],
      },
      {
        id: 'cerdo-pollo',
        titulo: 'Tributo al cerdo & pollo',
        tipo: 'platos',
        items: [
          {
            id: 'costillas',
            name: 'Costillas de cerdo',
            description:
              'Costilla ahumada al barril con una cocción de 4 horas, bañada en alguna de las salsas de la casa.',
            price: 44000,
            opciones: ['Uchuva', 'BBQ Jäger', 'Maracuyá'],
            modelo: 'costillas',
          },
          {
            id: 'pechuga-parrilla',
            name: 'Pechuga a la parrilla',
            description: 'Corte fino de pechuga a la parrilla.',
            price: 40000,
          },
          {
            id: 'pechuga-napolitana',
            name: 'Pechuga napolitana',
            description:
              'Corte fino de pechuga a la parrilla en salsa napolitana, tomate en rodajas y queso fundido.',
            price: 42000,
            modelo: 'pechuga-napolitana',
          },
        ],
      },
      {
        id: 'pescados',
        titulo: 'Pescados',
        tipo: 'platos',
        items: [
          {
            id: 'cazuela-mariscos',
            name: 'Cazuela de mariscos especial',
            description:
              'Selección de mariscos frescos que te transportarán a la costa con cada bocado.',
            price: 58000,
            destacado: true,
            foto: fotoWeb('cazuela-mariscos-vino'),
            alt: 'Cazuela de mariscos con copa de vino blanco y papa criolla, en la terraza.',
          },
          {
            id: 'salmon-parrilla',
            name: 'Salmón a la parrilla',
            description: 'Filete fresco y jugoso de salmón terminado en mantequilla de hierbas.',
            price: 54000,
          },
          {
            id: 'salmon-ajillo',
            name: 'Salmón al ajillo',
            description: 'Filete fresco y jugoso de salmón bañado en un delicioso ajillo del chef.',
            price: 55000,
          },
          {
            id: 'trucha',
            name: 'Trucha al ajillo o gratinada',
            description:
              'Trucha arcoíris a la plancha, bañada en un delicioso ajillo del chef o gratinada.',
            price: 42000,
            opciones: ['Al ajillo', 'Gratinada'],
          },
        ],
        pie: [`Acompañamientos (elige 2): ${ACOMPANAMIENTOS.join(', ')}.`],
      },
      {
        id: 'pastas',
        titulo: 'Pastas & arroces',
        tipo: 'platos',
        items: [
          {
            id: 'risotto-mariscos',
            name: 'Risotto de mariscos',
            description:
              'Arroz bomba acompañado con pulpo, calamar, mejillones, palmitos y camarones.',
            price: 46000,
            destacado: true,
          },
          {
            id: 'pasta-marinera',
            name: 'Pasta marinera',
            description:
              'Fettuccine en salsa de mariscos con pulpo, calamar, mejillones, palmitos y camarones, con queso parmesano.',
            price: 46000,
            modelo: 'pasta-marinera',
          },
          {
            id: 'arroz-thai',
            name: 'Arroz thai',
            description: 'Arroz con vegetales salteados, camarones, cubitos de pollo y cerdo.',
            price: 41000,
          },
          {
            id: 'vegano-rito',
            name: 'Vegano al Rito',
            description:
              'Fettuccine o arroz bomba en salsa blanca con orellanas y champiñones salteados.',
            price: 40000,
            opciones: ['Fettuccine', 'Arroz bomba'],
            modelo: 'vegano-rito',
          },
        ],
      },
      {
        id: 'burger',
        titulo: 'Burger',
        intro: 'Todas incluyen porción de papa a elección: francesa, casco o criolla.',
        tipo: 'platos',
        items: [
          {
            id: 'burger-la-plena',
            name: 'Burger La Plena',
            description:
              '150 g de carne seleccionada americana, doble queso (mozzarella fundente y campesino apanado), coronada con tocineta de res glaseada en melado de caña y tequila José Cuervo, y mayonesa artesanal de pepinillos.',
            price: 31000,
            modelo: 'burger-la-plena',
            foto: fotoWeb('hamburguesa-doble-aros'),
            alt: 'Hamburguesa doble con tocineta y aros de cebolla, de la cocina de RITO.',
          },
          {
            id: 'burger-smash',
            name: 'Burger smash Rito',
            description:
              'Doble carne smash seleccionada americana, mayosiracha, cebolla crispy y queso colby jack.',
            price: 30000,
            foto: fotoWeb('hamburguesa-doble-papas'),
            alt: 'Hamburguesa doble con papas rústicas y aros de cebolla.',
          },
          {
            id: 'burger-bufala',
            name: 'Burger di bufala',
            description:
              '150 g de carne seleccionada americana, mermelada de tomate cherry, queso de búfala y albahaca.',
            price: 30000,
          },
          {
            id: 'burger-bacon',
            name: 'Burger bacon',
            description:
              '150 g de carne seleccionada americana, con una deliciosa mermelada de tocineta, cebolla caramelizada y queso amarillo.',
            price: 30000,
            foto: fotoWeb('hamburguesa-rito-mano'),
            alt: 'Hamburguesa de la casa en mano, con las luces cálidas de la terraza al fondo.',
          },
          {
            id: 'burger-extraqueso',
            name: 'Burger extraqueso',
            description:
              '150 g de carne seleccionada americana rellena de queso blanco y bañada en queso amarillo y cebolla grillé.',
            price: 28000,
          },
          {
            id: 'burger-sencilla',
            name: 'Burger sencilla',
            description: '150 g de carne seleccionada americana, vegetales y queso.',
            price: 26000,
          },
        ],
        pie: ['Adiciones: tocineta $3.000 · carne de res $8.000 · porción de papa $5.000.'],
      },
      {
        id: 'mexicano',
        titulo: 'Mexicano ¡Órale!',
        intro: 'Sabores vibrantes, atrevidos y llenos de historia.',
        tipo: 'platos',
        items: [
          {
            id: 'nachos',
            name: 'Nachos pulled pork o birria',
            description:
              'Tortillas de maíz frito con cerdo o res desmechado bañado en salsa del chef, pico de gallo y guacamole.',
            price: 23000,
            precioTexto: 'Pequeños $23.000 · Grandes $31.500',
            opciones: ['Pulled pork', 'Birria'],
            foto: fotoWeb('plato-compartir-salsas'),
            alt: 'Plato para compartir con guacamole, pico de gallo y salsa de la casa.',
          },
          {
            id: 'tacos-lengua',
            name: 'Tacos de lengua',
            description: 'Tortillas de maíz con tierno corte de lengua y salsa del chef.',
            price: 25000,
          },
          {
            id: 'tacos-birria',
            name: 'Tacos de birria',
            description:
              'Tortillas de maíz con birria desmechada, salsa de chile, pico de gallo y queso gratinado.',
            price: 30000,
            destacado: true,
          },
        ],
      },
      {
        id: 'alitas',
        titulo: 'Alitas',
        intro:
          'Con papa francesa o casco, bastones de zanahoria y palitos de apio. Bañadas o con la salsa aparte.',
        tipo: 'lista',
        items: [
          { name: '6 piezas + 1 salsa', precios: [23000] },
          { name: '12 piezas + 2 salsas', precios: [28000] },
          { name: '24 piezas + 2 salsas', precios: [52000] },
          { name: '36 piezas + 3 salsas', precios: [72000] },
        ],
        pie: [
          'Salsas: BBQ Jäger (no pica) · miel mostaza (no pica) · búfalo (pica poco) · ajo parmesano (no pica) · uchuvas (no pica) · agridulce (picante suave) · BBQ picante (pica mucho).',
        ],
      },
      {
        id: 'infantil',
        titulo: 'Rito infantil',
        intro: 'Todas las opciones vienen con sorpresa, papa y bebida.',
        tipo: 'platos',
        items: [
          {
            id: 'pasta-minirito',
            name: 'Pasta al minirito',
            description:
              'Fettuccine con cubos de pollo y salsa blanca con queso parmesano, con papa francesa o casco.',
            price: 30000,
          },
          {
            id: 'baby-burger',
            name: 'Baby burger',
            description:
              '2 mini burgers de carne seleccionada americana con 120 g de res, con papa francesa o casco.',
            price: 27000,
          },
          {
            id: 'rito-nuggets',
            name: 'Rito nuggets',
            description: 'Pechuguitas de pollo apanadas, con papa francesa o casco.',
            price: 28000,
          },
        ],
      },
    ],
  },
  {
    id: 'dulce',
    titulo: 'Dulce',
    frase: 'Un clásico cremoso que siempre encanta.',
    imagen: '/images/salon-luz.webp',
    imagenAlt: 'Mesas del salón con la luz de la tarde entrando por el ventanal.',
    secciones: [
      {
        id: 'parfait',
        titulo: 'Parfait',
        tipo: 'lista',
        items: [
          {
            name: 'Frutos rojos',
            detalle: 'Yogur griego, granola, dulce de frutos rojos, fresas y arándanos.',
            precios: [13000],
          },
          {
            name: 'Frutos amarillos',
            detalle: 'Yogur griego, granola, mango, banano, torombolo y durazno.',
            precios: [13000],
          },
          {
            name: 'Cítrico',
            detalle: 'Yogur griego, granola, piña y dulce de kiwi.',
            precios: [13000],
          },
        ],
      },
      {
        id: 'malteadas',
        titulo: 'Malteadas',
        intro: 'Un clásico cremoso que siempre encanta.',
        tipo: 'lista',
        items: [
          { name: 'Frutos rojos', precios: [14000] },
          { name: 'Chocolate', precios: [14000] },
          { name: 'Vainilla', precios: [14000] },
          { name: 'Mango maracuyá', precios: [14000] },
          { name: 'Chocorramo (especial)', precios: [16000] },
          { name: 'Oreo (especial)', precios: [16000] },
        ],
      },
      {
        id: 'delicias',
        titulo: 'Delicias',
        tipo: 'lista',
        items: [
          {
            name: 'Torta de almojábana + helado',
            detalle: 'Con un shot de crema y helado.',
            precios: [12000],
          },
          {
            name: 'Rollos de canela',
            detalle: 'Sabor a maracuyá, arándanos o avellana.',
            precios: [12000],
          },
          { name: 'Brownie con helado', precios: [12000] },
        ],
      },
      {
        id: 'helados',
        titulo: 'Copas de helado',
        tipo: 'lista',
        items: [
          { name: 'Sencilla', detalle: '1 bolita + toppings de la casa.', precios: [4000] },
          { name: 'Doble', detalle: '2 bolitas + toppings de la casa.', precios: [7000] },
          { name: 'Triple', detalle: '3 bolitas + toppings de la casa.', precios: [11000] },
        ],
      },
    ],
  },
  {
    id: 'bebidas',
    titulo: 'Bebidas',
    frase: 'Refrescantes, vibrantes e inolvidables.',
    imagen: '/images/salon-lamparas.webp',
    imagenAlt: 'El salón con sus lámparas colgantes y la barra al fondo.',
    secciones: [
      {
        id: 'jugos',
        titulo: 'Jugos, batidos y sodas',
        tipo: 'lista',
        columnas: ['En leche', 'En agua'],
        items: [
          {
            name: 'Jugos',
            detalle: 'Mango, maracuyá, fresa, mora o lulo.',
            precios: [8000, 7000],
          },
          {
            name: 'Batidos y refrescantes',
            detalle: 'Piña hierbabuena, fresa sandía, mango maracuyá o arándanos.',
            precios: [10000, 9000],
          },
        ],
        pie: [
          'Sodas italianas (frutos rojos, lulo, lychee o maracuyá, con Hatsu o Bretaña): $14.000.',
          'Tamarindo escarchado Mil976: $15.000.',
        ],
      },
      {
        id: 'limonadas',
        titulo: 'Limonadas',
        tipo: 'lista',
        items: [
          { name: 'Natural', precios: [7000] },
          { name: 'Hierbabuena', precios: [7500] },
          { name: 'Cerezada', precios: [8000] },
          { name: 'Coco', precios: [9000] },
          { name: 'Brasileña', detalle: 'A base de leche condensada.', precios: [8000] },
        ],
      },
      {
        id: 'calientes',
        titulo: 'Bebidas calientes',
        tipo: 'lista',
        columnas: ['Sencillo', 'Doble'],
        items: [
          { name: 'Americano', precios: [3000, 4000] },
          { name: 'Expresso', precios: [3500, 4500] },
          { name: 'Tinto campesino', precios: [4000, null] },
          { name: 'Café latte', precios: [6000, null] },
          { name: 'Capuchino', precios: [6500, null] },
          { name: 'Capuchino Baileys', precios: [10000, null] },
          { name: 'Moccachino', precios: [7000, null] },
          { name: 'Irish coffee', detalle: 'Con whiskey.', precios: [9000, null] },
          { name: 'Milo frío o caliente', precios: [7500, null] },
          {
            name: 'Aromáticas',
            detalle: 'Hierbabuena, frutos rojos, durazno y papayuela.',
            precios: [4000, null],
          },
          { name: 'Frappuccino', precios: [8500, null] },
          { name: 'Café caramelo', precios: [8500, null] },
        ],
      },
      {
        id: 'frias',
        titulo: 'Gaseosas y cervezas',
        tipo: 'lista',
        items: [
          { name: 'Gaseosas', precios: [5000] },
          { name: 'Bretaña', precios: [5000] },
          { name: 'Té / soda Hatsu', precios: [7000] },
          { name: 'Agua con y sin gas', precios: [5000] },
          { name: 'Red Bull', precios: [10000] },
          { name: 'Electrolit', precios: [10000] },
          { name: 'Smirnoff Ice', precios: [15000] },
          { name: 'Smirnoff Ice Green Apple', precios: [15000] },
          { name: 'Heineken', precios: [7000] },
          {
            name: 'Tres Cordilleras',
            detalle: 'Mulata, mestiza, negra o rosada.',
            precios: [9000],
          },
          { name: 'Cusqueña Trigo', precios: [8000] },
          { name: 'Cerveza nacional', precios: [5500] },
          { name: 'Budweiser', precios: [6000] },
          { name: 'Club Colombia', precios: [7000] },
          { name: 'Cerveza Sol', precios: [7000] },
          { name: 'Coronita', precios: [7000] },
          { name: 'Corona', precios: [10000] },
          { name: 'Stella Artois', precios: [10000] },
          {
            name: 'Chelada mexicana',
            detalle:
              'Cerveza Sol, paleta de helado, topping de maracuyá, mango biche y frutos rojos.',
            precios: [13000],
          },
          {
            name: 'Chelada nacional',
            detalle: 'Cerveza nacional, paleta de helado, topping de maracuyá y mango biche.',
            precios: [12000],
          },
        ],
        pie: ['Chelada (limón y sal) $1.000 · Michelada (sal, limón, tabasco y tajín) $1.500.'],
      },
    ],
  },
  {
    id: 'bar',
    titulo: 'Coctelería y licores',
    frase: 'Cada cóctel es un rito, una alquimia de sabores que despierta los sentidos.',
    imagen: fotoWeb('coctel-autor-romero', 1600),
    imagenAlt: 'Cóctel de autor con romero y guarnición, en la barra de RITO.',
    secciones: [
      {
        id: 'cocteles',
        titulo: 'Cócteles',
        intro:
          'Como un lienzo en blanco, nuestras copas se llenan de colores y de esencias que narran historias antiguas y nuevas.',
        tipo: 'platos',
        items: [
          {
            id: 'mojito-clasico',
            name: 'Mojito clásico',
            description: 'Ron blanco, limón, hierbabuena y soda.',
            price: 24000,
          },
          {
            id: 'mojirito',
            name: 'Mojirito',
            description: 'Ron blanco, limón, hierbabuena y soda.',
            price: 25000,
            opciones: ['Manzana verde', 'Frutos rojos', 'Maracuyá'],
          },
          {
            id: 'mojito-jager',
            name: 'Mojito Jäger',
            description: 'Jägermeister, limón, ginger y hierbabuena.',
            price: 26000,
          },
          {
            id: 'black-rose',
            name: 'Black rose',
            description: 'Vodka, triple sec, zumo de mango, jugo de limón y crema de coco.',
            price: 26000,
          },
          {
            id: 'baileys',
            name: 'Baileys',
            description: 'Expreso de café, ron, Baileys, chocolate y canela.',
            price: 26000,
          },
          {
            id: 'summer-queen',
            name: 'Summer queen',
            description: 'Vodka, coronita y zumo de limón.',
            price: 27000,
          },
          {
            id: 'tequila-sunrise',
            name: 'Tequila sunrise',
            description: 'Tequila, triple sec, zumo de naranja y granadina.',
            price: 26000,
          },
          {
            id: 'pina-colada',
            name: 'Piña colada',
            description: 'Ron blanco, piña, leche condensada y crema de coco.',
            price: 25000,
          },
          {
            id: 'margarita',
            name: 'Margarita',
            description: 'Tequila, triple sec y zumo de limón, arándanos o uchuva.',
            price: 26000,
          },
          {
            id: 'margarita-kiwi',
            name: 'Margarita kiwi',
            description: 'Tequila, triple sec, sirope natural de kiwi, trozos de mango y tajín.',
            price: 27000,
          },
          {
            id: 'gin-tonic',
            name: 'Gin tonic',
            description: 'Ginebra, pepino, zumo de limón y agua tónica.',
            price: 26000,
            foto: fotoWeb('coctel-autor-gordons'),
            alt: 'Cóctel de ginebra con brocheta y romero sobre mármol negro.',
          },
          {
            id: 'aperol-spritz',
            name: 'Aperol spritz',
            description: 'Aperol, prosecco, soda y naranja.',
            price: 25000,
          },
          {
            id: 'rito',
            name: 'Rito',
            description:
              'Whiskey, tequila, Bacardí, triple sec, vino tinto, naranja, sirope, clara de huevo y tajín.',
            price: 28000,
            destacado: true,
            foto: fotoWeb('coctel-barra-neon'),
            alt: 'Cóctel de la casa frente a las luces neón de la barra.',
          },
          {
            id: 'copa-sangria',
            name: 'Copa sangría',
            description: 'Vino tinto, rodajas de naranja, manzana, fresa y uvas.',
            price: 24000,
          },
          {
            id: 'juramento',
            name: 'Juramento (cóctel para 2)',
            description: 'Cerveza negra Tres Cordilleras, Jäger, whiskey y expreso de café.',
            price: 47000,
          },
          {
            id: 'refajo-italiano',
            name: 'Refajo italiano',
            description: 'Disaronno licor de almendras, zumo de limón y cerveza rubia.',
            price: 23000,
          },
          { id: 'copa-vino', name: 'Copa de vino de la casa', price: 19000 },
          { id: 'vino-caliente', name: 'Vino caliente', price: 21000 },
          { id: 'shot-patron', name: 'Shot de Patrón', price: 25000 },
          {
            id: 'cocaina-rusa',
            name: 'Shot cocaína rusa',
            description: 'Vodka Sky, limón y café.',
            price: 18000,
          },
        ],
      },
      {
        id: 'vinos',
        titulo: 'Vinos',
        tipo: 'licores',
        items: [
          { name: 'Casillero del Diablo Merlot (Chile)', botella: 83000 },
          { name: 'Casillero del Diablo Shiraz Rosé (Chile)', botella: 85000 },
          { name: 'Santa Carolina Blanco (Chile)', botella: 60000 },
          { name: 'Santa Carolina Cabernet (Chile)', botella: 60000 },
          { name: 'Finca Las Moras Malbec (Argentina)', botella: 60000 },
          { name: 'Frontera Merlot (Chile)', botella: 70000 },
        ],
      },
      {
        id: 'whisky',
        titulo: 'Whisky',
        tipo: 'licores',
        items: [
          { name: "Buchanan's 18 años", botella: 480000 },
          { name: "Buchanan's Two Souls", botella: 290000 },
          { name: "Buchanan's Master", botella: 280000 },
          { name: "Buchanan's 12 años", shot: 20000, media: 140000, botella: 240000 },
          { name: 'Old Parr 12 años', botella: 240000 },
          { name: "Jack Daniel's No. 7", shot: 15000, media: 115000, botella: 200000 },
          { name: "Jack Daniel's Apple", shot: 15000, botella: 205000 },
          { name: "Jack Daniel's Honey", shot: 15000, media: 110000, botella: 205000 },
          { name: 'Johnnie Walker Black Label', media: 140000, botella: 230000 },
        ],
      },
      {
        id: 'tequila',
        titulo: 'Tequila',
        tipo: 'licores',
        items: [
          { name: 'José Cuervo', shot: 15000, media: 90000, botella: 140000 },
          { name: 'Jimador Reposado', shot: 15000, media: 120000, botella: 180000 },
          { name: 'Jimador Blanco', shot: 15000, botella: 170000 },
          { name: '1800 Reposado', botella: 300000 },
          { name: '1800 Silver', botella: 280000 },
        ],
      },
      {
        id: 'vodka',
        titulo: 'Vodka, hierbas y ginebra',
        tipo: 'licores',
        items: [
          { name: 'Absolut', media: 90000, botella: 165000 },
          { name: 'Smirnoff Vodka Red', shot: 15000, media: 80000, botella: 150000 },
          { name: 'Sky', botella: 170000 },
          { name: 'Jägermeister', shot: 15000, media: 110000, botella: 185000 },
          { name: "Ginebra Gordon's", shot: 15000, botella: 130000 },
        ],
      },
      {
        id: 'guaro',
        titulo: 'Guaro y ron',
        tipo: 'licores',
        items: [
          { name: 'Onix 100 años', botella: 120000 },
          { name: 'Aguardiente Líder', shot: 10000, media: 60000, botella: 90000 },
          { name: 'Onix Sello Negro / Sello Gris', shot: 10000, media: 60000, botella: 100000 },
          { name: 'Ron Boyacá', shot: 10000, media: 65000, botella: 105000 },
          { name: 'Ron Viejo de Caldas', shot: 10000, media: 65000, botella: 105000 },
        ],
      },
    ],
  },
]

/**
 * La carta lista para mostrar: cada plato o sección sin foto propia recibe su foto de
 * referencia de Pexels (ver `features/media/media.ts`).
 */
export const carta: Grupo[] = cartaBase.map((grupo) => ({
  ...grupo,
  secciones: grupo.secciones.map((seccion): Seccion => {
    if (seccion.tipo === 'platos') {
      return {
        ...seccion,
        items: seccion.items.map((plato) => {
          const ref = referencias[plato.id]
          if (plato.foto || !ref) return plato
          return {
            ...plato,
            foto: fotoPexels(ref),
            alt: `Foto de referencia de un plato similar a: ${plato.name}.`,
            referencia: true,
          }
        }),
      }
    }
    const ref = referencias[seccion.id]
    return ref ? { ...seccion, imagen: fotoPexels(ref, 1000) } : seccion
  }),
}))

/** Todos los platos con ficha (los de las secciones de tipo `platos`). */
export const platos: Dish[] = carta.flatMap((g) =>
  g.secciones.flatMap((s) => (s.tipo === 'platos' ? s.items : [])),
)

export function platoPorId(id: string) {
  return platos.find((p) => p.id === id)
}

const priceFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function formatPrice(price: number | null | undefined) {
  return price === null || price === undefined ? 'Consultar' : priceFormatter.format(price)
}

/** Precio de un plato tal como se muestra: el texto propio si lo tiene. */
export function precioDe(plato: Dish) {
  return plato.precioTexto ?? formatPrice(plato.price)
}
