# Konfiguratör Spec Preset Alanları

Engine'in okuduğu tüm key'ler ve karşılıkları. Ürün specs'lerini doldururken bu key'ler kullanılmalıdır.

---

## Basekit / Chassis

| Key | Label | Unit | Tip |
|-----|-------|------|-----|
| componentType | Bileşen Tipi | — | SELECT |
| socketType | CPU Soket Tipi | — | SELECT |
| ramType | RAM Tipi | — | SELECT |
| ramSlots | RAM Slot Sayısı | — | TEXT |
| maxRamCapacity | Max RAM Kapasitesi | GB | TEXT |
| pcieSlots | Toplam PCIe Slot Genişliği (fallback) | — | TEXT |
| pcieLayout | PCIe Layout (örn. 16,0,8o,0,0,0,1) | — | TEXT |
| nvmePorts | NVMe M.2 Yuva Sayısı | — | TEXT |
| ssdBays | 2.5" SSD Bay Sayısı | — | TEXT |
| hddBays | 3.5" HDD Bay Sayısı | — | TEXT |
| maxGpuLength | Max GPU Uzunluğu | mm | TEXT |
| maxGpuCount | Max GPU Sayısı | — | TEXT |
| supportsDualPsu | Çift PSU Desteği | — | SELECT |

## CPU

| Key | Label | Unit | Tip |
|-----|-------|------|-----|
| componentType | Bileşen Tipi | — | SELECT |
| socketRequired | Soket | — | SELECT |
| tdpWatts | TDP | W | TEXT |

## GPU

| Key | Label | Unit | Tip |
|-----|-------|------|-----|
| componentType | Bileşen Tipi | — | SELECT |
| tdpWatts | TDP | W | TEXT |
| pcieSlotWidth | Slot Genişliği (kaç slot kaplar) | — | SELECT |
| pcieLanesUsed | PCIe Lane (electrical) | — | SELECT |
| pcieMinPhysical | Min Fiziksel Slot | — | SELECT |
| lengthMm | Kart Uzunluğu | mm | TEXT |

## RAM

| Key | Label | Unit | Tip |
|-----|-------|------|-----|
| componentType | Bileşen Tipi | — | SELECT |
| ramType | Tip | — | SELECT |
| ramCapacityGb | Modül Kapasitesi | GB | SELECT |
| idleWatts | Idle Güç | W | TEXT |

## NVMe SSD

| Key | Label | Unit | Tip |
|-----|-------|------|-----|
| componentType | Bileşen Tipi | — | SELECT |
| storageInterface | Arayüz | — | SELECT (nvme_m2) |
| storageGb | Kapasite | GB | SELECT |
| idleWatts | Idle Güç | W | TEXT |

## 2.5" SSD

| Key | Label | Unit | Tip |
|-----|-------|------|-----|
| componentType | Bileşen Tipi | — | SELECT |
| storageInterface | Arayüz | — | SELECT (sata_2_5) |
| storageGb | Kapasite | GB | SELECT |
| idleWatts | Idle Güç | W | TEXT |

## HDD

| Key | Label | Unit | Tip |
|-----|-------|------|-----|
| componentType | Bileşen Tipi | — | SELECT |
| storageInterface | Arayüz | — | SELECT (sata_3_5) |
| storageGb | Kapasite | GB | SELECT |
| idleWatts | Idle Güç | W | TEXT |

## Güç Kaynağı (PSU)

| Key | Label | Unit | Tip |
|-----|-------|------|-----|
| componentType | Bileşen Tipi | — | SELECT |
| psuWatts | Güç | W | SELECT |

## Soğutma

| Key | Label | Unit | Tip |
|-----|-------|------|-----|
| componentType | Bileşen Tipi | — | SELECT |
| tdpWatts | Desteklenen Max TDP | W | TEXT |

## Genişleme Kartı

| Key | Label | Unit | Tip |
|-----|-------|------|-----|
| componentType | Bileşen Tipi | — | SELECT |
| pcieSlotWidth | Slot Genişliği | — | SELECT |
| pcieLanesUsed | PCIe Lane (electrical) | — | SELECT |
| pcieMinPhysical | Min Fiziksel Slot | — | SELECT |
| tdpWatts | Güç Tüketimi | W | TEXT |

## Ağ Kartı

| Key | Label | Unit | Tip |
|-----|-------|------|-----|
| componentType | Bileşen Tipi | — | SELECT |
| pcieSlotWidth | Slot Genişliği | — | SELECT |
| pcieLanesUsed | PCIe Lane (electrical) | — | SELECT |
| pcieMinPhysical | Min Fiziksel Slot | — | SELECT |
| tdpWatts | Güç Tüketimi | W | TEXT |

## İşletim Sistemi / Garanti / Güç Kablosu

Sadece `componentType` alanı var — engine bunlardan kaynak tüketmez.
