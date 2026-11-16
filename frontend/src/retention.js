export const RETENTION_DAYS = 7;
export const RETENTION_MS = RETENTION_DAYS*24*60*60*1000;
export const expired = (record,now=Date.now()) => Number.isFinite(record.lastActivityAt)&&now>=record.lastActivityAt+RETENTION_MS;
export const pruneInactive = (records,now=Date.now()) => {
 const kept=records.filter(record=>!expired(record,now));
 return kept.length===records.length?records:kept;
};
export const seedSaved = (records,now=Date.now()) => records.map((s,i)=>({...s,id:'saved-'+i,ownerId:0,lastActivityAt:now,members:[...s.members]}));
export const seedHistory = (records,now=Date.now()) => records.map(h=>({...h,lastActivityAt:now}));
