// import React, { useEffect, useState } from 'react';

// interface MediaItem {
//   _id: string;
//   url: string; // Adjust the key if your image URL field is named differently
//   name?: string;
// }

// const Media: React.FC = () => {
//   const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     fetchMedia();
//   }, []);

//   const fetchMedia = async () => {
//     try {
//       const res = await fetch('https://sova-admin.cyberxinfosolution.com/admin/api/media');
//       const data = await res.json();

//       if (data.success && Array.isArray(data.media)) {
//         setMediaItems(data.media);
//       } else {
//         console.error('Failed to fetch media');
//       }
//     } catch (err) {
//       console.error('Error fetching media:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 mt-10">
//       <h2 className="text-2xl font-semibold mb-6">Media Gallery</h2>

//       {loading ? (
//         <p>Loading images...</p>
//       ) : mediaItems.length === 0 ? (
//         <p>No media available.</p>
//       ) : (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//           {mediaItems.map((item) => (
//             <div key={item._id} className="border rounded overflow-hidden shadow-sm hover:shadow-md transition">
//               <img
//                 src={item.url}
//                 alt={item.name || 'Media'}
//                 className="w-full h-48 object-cover"
//               />
//               {item.name && <div className="p-2 text-center text-sm">{item.name}</div>}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Media;

import React, { useEffect, useState } from 'react';

interface MediaItem {
  _id: string;
  url: string;
  name?: string;
}

const fallbackImages: MediaItem[] = [
  { _id: 'local1', url: '/images/user/user-02.jpg', name: 'Image 1' },
  { _id: 'local2', url: '/images/product/image.png', name: 'Image 2' },
  { _id: 'local3', url: '/images/cards/card-01.png', name: 'Image 3' },
  { _id: 'local4', url: '/images/logo/logo.png', name: 'Image 4' },
];

const Media: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch('https://sova-admin.cyberxinfosolution.com/admin/api/media');
      const data = await res.json();

      if (data.success && Array.isArray(data.images) && data.images.length > 0) {
        const formattedMedia = data.images.map((url: string, index: number) => ({
          _id: `server-${index}`,
          url,
          name: `Image ${index + 1}`,
        }));
        setMediaItems(formattedMedia);
      } else {
        console.warn('No images found, using fallback images.');
        setMediaItems(fallbackImages);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
      setMediaItems(fallbackImages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10">
      <h2 className="text-2xl font-semibold mb-6">Media Gallery</h2>

      {loading ? (
        <p>Loading images...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...mediaItems].reverse().map((item) => (
            <div key={item._id} className="border rounded overflow-hidden shadow-sm hover:shadow-md transition">
              <img
                src={`${process.env.REACT_APP_API_URL}${item.url}`}
                alt={item.name || 'Media'}
                className="w-full h-48 object-cover"
              />
              {item.name && <div className="p-2 text-center text-sm">{item.name}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Media;
