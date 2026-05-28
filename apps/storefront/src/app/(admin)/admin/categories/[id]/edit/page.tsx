import Link from "next/link";

export default function CategoryEdit() {
  return (
    <div className="row">
      {/* ── Left Column ── */}
      <div className="col-lg-4 col-xl-3">
        <div className="card">
          <div className="card-body">
            <div className="bg-light rounded text-center p-3">
              <img src="https://techzaa.in/larkon/admin/assets/images/product/p-1.png" alt="" className="avatar-xxl" />
            </div>

            <div className="mt-3">
              <h5 className="mb-1 fw-semibold">Fashion Men , Women &amp; Kid&apos;s</h5>

              <div className="row mt-3">
                <div className="col-12 mb-2">
                  <p className="text-muted mb-0 fs-13">Created By :</p>
                  <h6 className="mb-0 fw-semibold">Seller</h6>
                </div>
                <div className="col-6">
                  <p className="text-muted mb-0 fs-13">Stock :</p>
                  <h6 className="mb-0 fw-semibold">46233</h6>
                </div>
                <div className="col-6">
                  <p className="text-muted mb-0 fs-13">ID :</p>
                  <h6 className="mb-0 fw-semibold">FS16276</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer bg-light-subtle d-flex gap-2">
            <Link href="/admin/categories" className="btn btn-outline-light flex-fill btn-sm">Create Category</Link>
            <Link href="/admin/categories" className="btn btn-primary flex-fill btn-sm">Cancel</Link>
          </div>
        </div>
      </div>

      {/* ── Right Column ── */}
      <div className="col-lg-8 col-xl-9">
        {/* Thumbnail Upload */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Add Thumbnail Photo</h4>
          </div>
          <div className="card-body">
            <div className="border border-dashed rounded text-center p-5 cursor-pointer">
              <iconify-icon icon="solar:cloud-upload-bold-duotone" className="fs-48 text-primary mb-2 d-block"></iconify-icon>
              <h5 className="fw-medium">Drop your images here, or <span className="text-primary">click to browse</span></h5>
              <p className="text-muted mb-0 fs-13 mt-1">1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed.</p>
            </div>
          </div>
        </div>

        {/* General Info */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">General Information</h4>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-lg-6">
                <label htmlFor="category-title" className="form-label">Category Title</label>
                <input type="text" id="category-title" className="form-control" placeholder="Enter Title" defaultValue="Fashion Men , Women & Kid's" />
              </div>

              <div className="col-lg-6">
                <label htmlFor="crater" className="form-label">Created By</label>
                <select className="form-control form-select" id="crater" defaultValue="Seller">
                  <option value="">Select Creator</option>
                  <option value="Seller">Seller</option>
                  <option value="Admin">Admin</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-lg-6">
                <label htmlFor="product-stock" className="form-label">Stock</label>
                <input type="number" id="product-stock" className="form-control" placeholder="Quantity" defaultValue="46233" />
              </div>

              <div className="col-lg-6">
                <label htmlFor="product-id" className="form-label">Tag ID</label>
                <input type="text" id="product-id" className="form-control" placeholder="#******" defaultValue="FS16276" />
              </div>

              <div className="col-lg-12">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" id="description" rows={5} defaultValue="Aurora Fashion has once again captivated fashion enthusiasts with its latest collection, seamlessly blending elegance with comfort in a range of exquisite designs."></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Meta Options */}
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Meta Options</h4>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-lg-6">
                <label htmlFor="meta-title" className="form-label">Meta Title</label>
                <input type="text" id="meta-title" className="form-control" placeholder="Enter Title" defaultValue="Fashion Brand" />
              </div>
              <div className="col-lg-6">
                <label htmlFor="meta-tag" className="form-label">Meta Tag Keyword</label>
                <input type="text" id="meta-tag" className="form-control" placeholder="Enter word" defaultValue="fashion" />
              </div>
              <div className="col-lg-12">
                <label htmlFor="meta-description" className="form-label">Meta Description</label>
                <textarea className="form-control" id="meta-description" rows={3} placeholder="Type description"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex gap-2 justify-content-end mb-3">
          <Link href="/admin/categories" className="btn btn-outline-light">Cancel</Link>
          <Link href="/admin/categories" className="btn btn-primary">Save Change</Link>
        </div>
      </div>
    </div>
  );
}
