export const reorder = <T>(
  list: T[],
  {
    destinationIndex,
    sourceIndex,
  }: { destinationIndex: number; sourceIndex: number }
): T[] => {
  const updatedList = [...list]
  const [movedItem] = updatedList.splice(sourceIndex, 1)
  updatedList.splice(destinationIndex, 0, movedItem)
  return updatedList
}

export const removeFromList = <T>(list: T[], targetIndex: number): T[] => {
  // Clone the list (fastest way to clone, https://web.archive.org/web/20170824010701/https://jsperf.com/cloning-arrays/3)
  const clonedList = list.slice(0)
  // Remove the target from the list
  clonedList.splice(targetIndex, 1)
  return clonedList
  // return list.filter((data, index) => index !== targetIndex);
}

export const addToList = <T>(
  list: T[],
  { targetIndex, item }: { targetIndex: number; item: T }
): T[] => {
  const clonedList = list.slice(0)
  // Add the item to a certain position
  clonedList.splice(targetIndex, 0, item)
  return clonedList
}
