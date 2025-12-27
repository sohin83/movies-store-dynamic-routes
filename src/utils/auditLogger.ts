export async function auditLog(params: {
   userId?: string;
   entity: string;
   action: string;
   entityId?: string;
}) {
   console.log('[AUDIT]', {
      timestamp: new Date().toISOString(),
      ...params,
   });

   // later: save to DB
}
