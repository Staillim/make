// Barrel de stores Zustand.
// Sólo exporta stores vivos. useAuthStore fue eliminado porque nadie lo populaba
// y causaba que Sidebar/Header mostraran siempre "Plan free / Usuario".
export { useNegocioStore } from "./negocio-store";
export { useConstructorStore } from "./constructor-store";