import { registryConfig } from "@/config/registry"

export function getRegistryItemUrl(item: string) {
  return registryConfig.namespaceUrl.replace("{name}", item)
}

export function getRegistryItemNamespace(item: string) {
  return `${registryConfig.namespace}/${item}`
}
