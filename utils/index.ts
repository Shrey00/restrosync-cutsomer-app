import * as SecureStore from "expo-secure-store";
export async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}
export async function getValueFor(key: string) {
  try {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
  }
}
export async function deleteKey(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (e) {
    console.log(e);
  }
}
export function updateToken(newToken: string) {
  deleteKey("token");
  save("token", newToken);
}

export function checkArrayValueEquality(arr1: any, arr2: any) {
  if (arr1.length !== arr2.length) return false;
  const map1 = new Map(arr1.map((item: any) => [item.id, item]));
  const map2 = new Map(arr2.map((item: any) => [item.id, item]));
  return (
    arr1.every((item: any) => map2.has(item.id)) &&
    arr2.every((item: any) => map1.has(item.id))
  );
}