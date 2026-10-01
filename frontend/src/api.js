// BACKEND TODO: see ../../TODO_BACKEND.md. These stubs describe every operation the UI needs; implement them as an API or as in-app services.
// All backend calls live here. Every function is a STUB.
// TODO(backend): set VITE_API_BASE in .env, then replace each stub with a fetch() call (attach the auth token).
export const API_BASE = import.meta.env.VITE_API_BASE || '';

const notImplemented = (name) => { throw new Error(name + ' is not implemented yet'); };

// TODO(backend): POST /auth/cherish (Ya Kun Cherish SSO -> session token)
export const loginWithCherish = async () => notImplemented('loginWithCherish');

// TODO(backend): GET /me (profile + Cherish points balance)
export const getMe = async () => notImplemented('getMe');

// TODO(backend): GET /menu?outletId= (items, prices, availability)
export const getMenu = async () => notImplemented('getMenu');

// TODO(backend): GET /outlets?supportsTogether=true&groupSize= (wait time, slot capacity)
export const getOutlets = async () => notImplemented('getOutlets');

// TODO(backend): POST /groups (name, deadline, outletId, slot, payMode) -> groupId + invite URL
export const createGroup = async () => notImplemented('createGroup');

// TODO(backend): GET /groups/:id (participants, statuses, totals; participants only)
export const getGroup = async () => notImplemented('getGroup');

// TODO(backend): POST /groups/:id/join (validate invite token; reject expired/full)
export const joinGroup = async () => notImplemented('joinGroup');

// TODO(backend): DELETE /groups/:id/participants/:userId (organiser only)
export const removeParticipant = async () => notImplemented('removeParticipant');

// TODO(backend): PATCH /groups/:id (extend deadline; notify)
export const updateDeadline = async () => notImplemented('updateDeadline');

// TODO(backend): PUT /groups/:id/orders/me (own order only; reject after deadline)
export const submitOrder = async () => notImplemented('submitOrder');

// TODO(backend): POST /payments (existing Ya Kun payment flow). This should AUTHORISE the amount (a hold), not charge
// immediately — the real capture happens in sendToOutlet below. Organiser sees status only, never credentials.
export const pay = async () => notImplemented('pay');

// TODO(backend): GET /cherish/rewards (eligible rewards for the current user)
export const getRewards = async () => notImplemented('getRewards');

// TODO(backend): POST /groups/:id/send (consolidate, send one order to outlet, lock outlet/time). This is also when any
// applied Cherish reward's points cost is captured/deducted, since the order can no longer change after this.
export const sendToOutlet = async () => notImplemented('sendToOutlet');

// TODO(backend): POST /groups/:id/collected (organiser confirms handover). Credits each submitted member's earned
// Cherish points now that the purchase is complete, and writes a points-history entry.
export const markCollected = async () => notImplemented('markCollected');

// TODO(backend): GET /groups/:id/status (preparing / ready + collection number)
export const getOrderStatus = async () => notImplemented('getOrderStatus');

// TODO(backend): GET /saved-groups
export const getSavedGroups = async () => notImplemented('getSavedGroups');

// TODO(backend): GET /notifications
export const getNotifications = async () => notImplemented('getNotifications');

// Added for the full MVP journey
// TODO(backend): POST /groups/:id/leave (participant leaves; order removed)
export const leaveGroup = async () => notImplemented('leaveGroup');

// TODO(backend): POST /groups/:id/close-ordering (organiser closes early; also runs automatically at the deadline)
export const closeOrdering = async () => notImplemented('closeOrdering');

// TODO(backend): POST /groups/:id/remind {userId,type} (order or payment reminder push)
export const remind = async () => notImplemented('remind');

// TODO(backend): GET /group-orders/history (previous group orders + the user's own items)
export const getHistory = async () => notImplemented('getHistory');

// TODO(backend): POST /saved-groups, PATCH /saved-groups/:id (save and rename), POST /groups from a saved group
export const saveGroup = async () => notImplemented('saveGroup');
