$ErrorActionPreference = "Stop"
$assets = "C:\Users\admin\.cursor\projects\e-2sri-nokri-jea\assets"
$pub = "E:\2sri nokri\jea\public\images"
$prefix = "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_31d6e0d15bd38481acbebc9a9471d8f7_images_image-"

$pairs = @(
  @("c3b1091b-a918-420e-bec9-35bf1abc8b6c.jpg", "products/rice/japonica-short-grain-hero.jpg"),
  @("16851370-cb77-4530-99bf-2bad75dc5109.jpg", "products/coffee/roasted-arabica-coffee-beans.png"),
  @("003b9b52-7757-407f-ae61-bf509f5e6c11.jpg", "products/rice/basmati-hero-unique.png"),
  @("c804a7dc-0fc4-4499-b8c9-cd58dc88d60b.jpg", "products/rice/long-grain-white-hero.png"),
  @("cc077084-230a-4db4-84dc-99c08fc195bb.jpg", "products/rice/parboiled-golden-hero.png"),
  @("40d27597-c251-4ca6-bda0-f69adec97efd.jpg", "products/sugar/sugar-category-hero.png"),
  @("51f5ad4e-1b24-455a-ad81-f15d88b82ddc.jpg", "products/spices/spices-category-hero.png"),
  @("a64a775b-22e7-4b53-9608-a299c9319b43.jpg", "products/beans/dry-chickpeas.png"),
  @("583556ba-b319-430c-a3ca-62df101a73d3.jpg", "verification/intro-banner.png"),
  @("d88015ed-625a-4523-8051-a25178c7aabe.jpg", "verification/pillar-registration.jpg"),
  @("4daa0aca-f1e9-4d13-b7da-596df58733ad.jpg", "contact/enquiry-cta.jpg"),
  @("d47b59b0-7f68-42b2-9cc6-95fa55b52e9f.jpg", "home/logistics-band-intermodal-yard.jpg"),
  @("53c20a4d-6fc9-4198-949c-2025e34799ed.jpg", "home/packaging-teaser-grain-rail.jpg"),
  @("59f37894-7f11-4ef9-8562-63b5b7e45ff1.jpg", "insights/cover-international-rail-containers.jpg"),
  @("1e994292-0ea8-4d54-a9b0-19afb0795341.jpg", "insights/cover-purchase-requests.jpg"),
  @("a49e21a7-aeb3-467d-8603-9123406483e9.jpg", "verification/cta-band.jpg"),
  @("b85e0ed3-5b1f-4799-a2ff-c0f40c58f882.jpg", "packaging/bulk-railcar.jpg"),
  @("b28a95bd-8daf-4083-9fe9-6c483e5e04fe.jpg", "packaging/bulk-vessel-hold.png"),
  @("ee126071-ab9a-46a9-bab1-0449b1d7e8b9.jpg", "packaging/tanker-vessel.jpg"),
  @("824ee2f1-fc7e-4609-8596-9c13990706cc.jpg", "dispute-resolution/hero.jpg"),
  @("ea9ab47f-4475-466a-96a8-8c5954771703.jpg", "home/bulk-vessel-card-unique.png"),
  @("210266c1-b6d7-43eb-9f00-8d783d321110.jpg", "home-2.png"),
  @("0a1fab38-4a23-4297-bbd3-cd8f65d45a15.jpg", "logistics/container-terminal-operations-alt.jpg"),
  @("5a6e2067-8940-4df0-8afb-1960ac3a5590.jpg", "logistics/rail-intermodal-yard-alt.png"),
  @("a41c5347-801d-4fb1-8453-3f5d1bd111a2.jpg", "products/coffee/coffee-wet-mill-processing.jpg"),
  @("b72c93dd-f1e0-4e20-b8ba-73d7b5097577.jpg", "home/insights-teaser.jpg"),
  @("1ae78891-d6df-4418-8db6-38d65ecf36c4.jpg", "products/sugar/icumsa-45-lab-quality.jpg"),
  @("fdcd54a8-eced-499a-a594-d15513ca67c3.jpg", "products/sugar/icumsa-100-warehouse-aisle.jpg"),
  @("66d0b2d1-2bcf-4c85-80e5-e9606e0d5885.jpg", "products/sugar/icumsa-150-warehouse-sampling.jpg"),
  @("a7fb5a1d-bcbc-40d9-b812-2c359528a205.jpg", "products/sugar/icumsa-600-raw-pile.jpg"),
  @("1c34e1e6-452c-438b-9140-86a446d6348e.jpg", "products/sugar/icumsa-1200-raw-scoop.jpg"),
  @("bec35793-10d0-4dc6-b017-838e11bb5a58.jpg", "products/coffee/roasted-coffee-moisture-qc.jpg"),
  @("4464a8d8-da4a-4f3d-ba03-4223bd1c2a93.jpg", "products/coffee/green-coffee-grading-table.jpg")
)

foreach ($pair in $pairs) {
  $src = Join-Path $assets ($prefix + $pair[0])
  $dest = Join-Path $pub $pair[1]
  $destDir = Split-Path $dest -Parent
  if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
  if (-not (Test-Path $src)) { throw "Missing asset: $src" }
  Copy-Item -Path $src -Destination $dest -Force
  Write-Host "OK $($pair[1])"
}

Write-Host "Deployed $($pairs.Count) images."
