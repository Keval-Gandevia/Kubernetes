provider "google" {
  credentials = file("/home/gandeviakeval05/cloud-computing-428914-0080b9336654.json")
  project     = "cloud-computing-428914"
  region      = "us-central1"
  zone        = "us-central1-c"
}

resource "google_container_cluster" "gke_cluster" {
  name     = "gke-cluster"
  location = "us-central1"

  initial_node_count = 1

  node_locations = ["us-central1-c"]

  node_config {
    machine_type = "e2-small"
    disk_size_gb = 10
    disk_type    = "pd-standard"
    image_type   = "COS_CONTAINERD"
  }

  # Update deletion_protection to false
  deletion_protection = false

}