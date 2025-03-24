// import { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';
// import { PropertyStats } from './PropertyStats';
// import { PropertyHeader } from './PropertyHeader';
// import { PropertyActions } from './PropertyActions';
// import { NearbyFacilities } from '../report/NearbyFacilities';
// import { PropertyGraph } from '../report/PropertyGraph';
// import { PropertyDescriptionCard } from '../report/PropertyDescriptionCard';
// import { LocalityStats } from '../report/LocalityStats';
// import { useAuthStore } from '../../store/authStore';
// import { usePropertyStore } from '../../store/propertyStore';
// import { PropertyTabs } from './PropertyTabs';
// import PropertyGallery from './PropertyGallery';
// import OverviewCard from '../report/OverviewCardProps';
// import FloorPlan from '../report/FloorPlan';
// import Amenities from '../report/Amenities';
// import FAQ from '../report/FAQ';
// import { PropertyChatButton } from '../chat/PropertyChatButton';
// import { Property } from '../../types';
// import { NeighborhoodMap } from './NeighborhoodMap';

// export function PropertyDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuthStore();
//   const { getPropertyById } = usePropertyStore();
//   const [property, setProperty] = useState<Property | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('NearbyFacilities');
//   const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
//   // const [starTransition, setStartTransition] = useState<boolean>(false);

//   // useEffect(() => {
//   //   // Set a timer to change the state to true after 10 seconds
//   //   const timer = setTimeout(() => {
//   //     setStartTransition(true);
//   //   }, 10000); // 10 seconds

//   //   // Clean up the timer when the component unmounts
//   //   return () => clearTimeout(timer);
//   // }, []);

//   // Section Refs
//   const nearbyRef = useRef<HTMLDivElement | null>(null);
//   const graphRef = useRef<HTMLDivElement | null>(null);
//   const statsRef = useRef<HTMLDivElement | null>(null);
//   const overviewRef = useRef<HTMLDivElement | null>(null);
//   const descriptionRef = useRef<HTMLDivElement | null>(null);
//   const floorPlanRef = useRef<HTMLDivElement | null>(null);
//   const galleryRef = useRef<HTMLDivElement | null>(null);
//   const amenitiesRef = useRef<HTMLDivElement | null>(null);
//   const faqRef = useRef<HTMLDivElement | null>(null);
//   const mapRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const fetchProperty = async () => {
//       if (id) {
//         try {
//           const data = await getPropertyById(id);
//           if (data) {
//             setProperty({
//               ...data,
//               imageUrl: data.imageUrl,
//               id: data.id,
//               title: data.title,
//               price: data.price,
//               location: data.location,
//               bedrooms: data.bedrooms,
//               bathrooms: data.bathrooms,
//               sqft: data.sqft,
//               description: data.description
//             });
//           }
//         } catch (error) {
//           console.error('Error fetching property:', error);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchProperty();
//   }, [id, getPropertyById]);

//   useEffect(() => {
//     if (property?.images) {
//       const images = Object.values(property.images).filter(Boolean); // Filter out any undefined images
//       if (images.length > 0) {
//         const interval = setInterval(() => {
          
//           setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
//         }, 3000); // Adjust time as needed
//         return () => clearInterval(interval);
//       }
//     }
//   }, [property]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-pulse text-gray-500">Loading property details...</div>
//       </div>
//     );
//   }

//   if (!property) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-gray-500">Property not found</div>
//       </div>
//     );
//   }

//   const imageUrls = property.images ? Object.values(property.images).flat() : [];

//   const handleTabClick = (tab: string) => {
//     setActiveTab(tab);
//     const refs = {
//       OverviewCard: overviewRef,
//       FloorPlan: floorPlanRef,
//       PropertyGallery: galleryRef,
//       NearbyFacilities: nearbyRef,
//       PropertyGraph: graphRef,
//       LocalityStats: statsRef,
//       Amenities: amenitiesRef,
//       FAQ: faqRef,
//       NeighborhoodMap: mapRef
//     };

//     refs[tab as keyof typeof refs]?.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <>
//       <div className="max-w-6xl mx-auto p-4 space-y-6">
//         <div className="flex justify-between items-center">
//           <button 
//             onClick={() => navigate(-1)}
//             className="p-2 -ml-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
//             aria-label="Back"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <PropertyActions property={property} />
//         </div>

//         {/* <div className="aspect-video w-full max-h-[400px] rounded-lg overflow-hidden border border-gray-300">
//           <img
//             src={property.imageUrl}
//             alt={property.title}
//             className="w-full h-full object-cover"
//           />
//         </div> */}
//         <div className="aspect-video w-full max-h-[400px] rounded-lg overflow-hidden border border-gray-300">
//   {/* Image Slider */}
//           {/* {starTransition ? ( */}
//           <div className="relative w-full h-full">
//             {imageUrls.map((image, index) => (
//               <img
//                 key={index}
//                 src={image || ''}
//                 alt={property.title}
//                 className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
//                 loading="lazy"
//               />
//             ))}
//             <div className="absolute bottom-2 right-2 text-white text-[10px] font-semibold bg-black bg-opacity-50 rounded-xl px-1.5 py-0.5">
//             {currentImageIndex + 1}/{imageUrls.length}
//           </div>
//           </div>
//           {/* ) : (
//             <img
//               src={property.imageUrl}
//               alt={property.title}
//               className="w-full h-full object-cover"
//               loading="lazy"
//             />
//           )} */}
//           {/* Current Image Number / Total Images */}
          
// </div>


//         <div className="space-y-3">
//           <PropertyHeader property={property} />
//           <PropertyStats property={property} />
//           {/* <div className="prose max-w-none">
//             <p className="text-gray-700 leading-relaxed">{property.description}</p>
//           </div> */}
//         </div>

//         <div className="sticky top-16 z-48 bg-white rounded-md shadow-md">
//           <PropertyTabs activeTab={activeTab} onTabClick={handleTabClick} />
//         </div>

//         <div>
//           <div ref={overviewRef}>
//             <OverviewCard
//               projectName="Ashar Pulse"
//               projectArea="2.35 Acres"
//               sizes="441 - 750 sq.ft."
//               projectSize="2 Buildings - 760 units"
//               launchDate="Oct, 2022"
//               avgPrice="21.54 K - 23.33 K/sq.ft"
//               possessionStarts="Dec, 2028"
//               configurations="1, 2 BHK Apartments"
//               reraId="P51700047432"
//             />
//           </div>

//           <div ref={descriptionRef}>
//             <PropertyDescriptionCard title={property.title} description={property.description} />
//           </div>
          
//           <div ref={floorPlanRef}>
//             <FloorPlan />
//           </div>
          
//           <div ref={nearbyRef}>
//             <NearbyFacilities propertyId={property.id} />
//           </div>

//           {/* <div ref={mapRef}>
//             <NeighborhoodMap
//               latitude={property.latitude || 19.0760}
//               longitude={property.longitude || 72.8777}
//               propertyTitle={property.title}
//             />
//           </div> */}

//           <div ref={mapRef}>
//             <NeighborhoodMap
//               latitude={19.0760}
//               longitude={72.8777}
//               propertyTitle={property.title}
//             />
//           </div>

//           <div ref={galleryRef}>
//             <PropertyGallery images={[]} />
//           </div>
          
//           <div ref={statsRef}>
//             <LocalityStats propertyId={property.id} />
//           </div>

//            <div ref={amenitiesRef}>
//             <Amenities />
//           </div>

//           <div ref={faqRef}>
//             <FAQ />
//           </div>

//            <div ref={graphRef}>
//             <PropertyGraph propertyId={property.id} />
//           </div>

          
//         </div>
//       </div>

//       <PropertyChatButton property={property} />
//     </>
//   );
// }


import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PropertyStats } from './PropertyStats';
import { PropertyHeader } from './PropertyHeader';
import { PropertyActions } from './PropertyActions';
import { PropertyGraph } from '../report/PropertyGraph';
import { PropertyDescriptionCard } from '../report/PropertyDescriptionCard';
import { LocalityStats } from '../report/LocalityStats';
import { usePropertyStore } from '../../store/propertyStore';
import { PropertyTabs } from './PropertyTabs';
import PropertyGallery from './PropertyGallery';
import OverviewCard from '../report/OverviewCardProps';
import FloorPlan from '../report/FloorPlan';
import Amenities from '../report/Amenities';
import FAQ from '../report/FAQ';
import { PropertyChatButton } from '../chat/PropertyChatButton';
import { Property } from '../../types';
import { NeighborhoodMap } from './NeighborhoodMap';
import { PropertyScore } from '../report/PropertyScore';
import mockPriceTendData from '../../mockData/priceTendData';

export function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPropertyById } = usePropertyStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('OverviewCard');
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Section Refs
  const graphRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const floorPlanRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const amenitiesRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const scoreRef = useRef<HTMLDivElement | null>(null);

  // Track all section refs in a map for easy access
  const sectionRefs = {
    OverviewCard: overviewRef,
    FloorPlan: floorPlanRef,
    // NearbyFacilities: nearbyRef,
    NeighborhoodMap: mapRef,
    PropertyGallery: galleryRef,
    Amenities: amenitiesRef,
    FAQ: faqRef,
    PropertyGraph: graphRef,
    LocalityStats: statsRef
  };

  useEffect(() => {
    const fetchProperty = async () => {
      if (id) {
        try {
          const data = await getPropertyById(id);
          if (data) {
            setProperty({
              ...data,
              imageUrl: data.imageUrl,
              id: data.id,
              title: data.title,
              price: data.price,
              location: data.location,
              bedrooms: data.bedrooms,
              bathrooms: data.bathrooms,
              sqft: data.sqft,
              description: data.description
            });
          }
        } catch (error) {
          console.error('Error fetching property:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProperty();
  }, [id, getPropertyById]);

  useEffect(() => {
    if (property?.images) {
      const images = Object.values(property.images).filter(Boolean);
      if (images.length > 0) {
        const interval = setInterval(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
      }
    }
  }, [property]);

  // Set up Intersection Observer to track which section is visible
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50% 0px', // Less restrictive margin
      threshold: 0.05 // Lower threshold for detection
    };

    // Create observers for each section
    Object.entries(sectionRefs).forEach(([tabId, ref]) => {
      if (ref.current) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveTab(tabId);
            }
          });
        }, observerOptions);
        
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    // Clean up observers on component unmount
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [property]); 

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Property not found</div>
      </div>
    );
  }

  const imageUrls = property.images ? Object.values(property.images).flat() : [];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    const ref = sectionRefs[tab as keyof typeof sectionRefs];
    ref?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <PropertyActions property={property} />
        </div>

        <div className="aspect-video w-full max-h-[400px] rounded-lg overflow-hidden border border-gray-300">
          <div className="relative w-full h-full">
            {imageUrls.map((image, index) => (
              <img
                key={index}
                src={image || ''}
                alt={property.title}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
              />
            ))}
            <div className="absolute bottom-2 right-2 text-white text-[10px] font-semibold bg-black bg-opacity-50 rounded-xl px-1.5 py-0.5">
              {currentImageIndex + 1}/{imageUrls.length}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <PropertyHeader property={property} />
          <PropertyStats property={property} />
        </div>

        <div className="sticky top-16 z-50 bg-white rounded-md shadow-md">
          <PropertyTabs activeTab={activeTab} onTabClick={handleTabClick} />
        </div>

        <div>
          <div ref={overviewRef}>
            <OverviewCard
              projectName="Ashar Pulse"
              projectArea="2.35 Acres"
              sizes="441 - 750 sq.ft."
              projectSize="2 Buildings - 760 units"
              launchDate="Oct, 2022"
              avgPrice="21.54 K - 23.33 K/sq.ft"
              possessionStarts="Dec, 2028"
              configurations="1, 2 BHK Apartments"
              reraId="P51700047432"
            />
          </div>

          <div ref={scoreRef}>
            <PropertyScore propertyId={property.id} />
          </div>

          <div ref={descriptionRef}>
            <PropertyDescriptionCard title={property.title} description={property.description} />
          </div>
          
          <div ref={floorPlanRef}>
            <FloorPlan />
          </div>

          <div ref={mapRef}>
            <NeighborhoodMap
              latitude={19.0760}
              longitude={72.8777}
              propertyTitle={property.title}
            />
          </div>

          <div ref={galleryRef}>
            <PropertyGallery images={[]} />
          </div>
          
          {/* <div ref={statsRef}>
            <LocalityStats propertyId={property.id} />
          </div> */}

          <div ref={amenitiesRef}>
            <Amenities />
          </div>

          <div ref={faqRef}>
            <FAQ />
          </div>

          <div ref={graphRef}>
            <PropertyGraph propertyId={property.id} data={mockPriceTendData} />
          </div>
        </div>
      </div>

      <PropertyChatButton property={property} />
    </>
  );
}