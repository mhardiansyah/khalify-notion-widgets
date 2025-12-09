// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/app/lib/supabaseClient";

// export default function CallbackBody() {
//   const router = useRouter();

//   useEffect(() => {
//     const finish = async () => {
//       // Supabase otomatis handle PKCE di URL
//       const { data } = await supabase.auth.getUser();

//       if (data.user) {
//         console.log("LOGIN SUCCESS:", data.user);
//         router.replace("/welcome");
//       } else {
//         console.log("NOT LOGGED IN");
//         router.replace("/login");
//       }
//     };

//     finish();
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       Verifying...
//     </div>
//   );
// }
