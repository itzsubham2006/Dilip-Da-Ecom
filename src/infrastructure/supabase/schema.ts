// Database types generated from Supabase schema
// Run `npx supabase gen types typescript --linked > src/infrastructure/supabase/schema.ts`
// after the schema is deployed

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      // Placeholder — will be populated after schema deployment
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
