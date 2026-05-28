'use client';


export default function SettingsPage() {
  return (
    <>
<div className="row mb-4">
<div className="col-lg-12">
<div className="card">
<div className="card-header">
<h4 className="card-title d-flex align-items-center gap-1"><iconify-icon className="text-primary fs-20" icon="solar:settings-bold-duotone"></iconify-icon>General Settings</h4>
</div>
<div className="card-body">
<div className="row">
<div className="col-lg-6">
<form>
<div className="mb-3">
<label className="form-label" htmlFor="meta-name">Meta Title</label>
<input className="form-control" id="meta-name" placeholder="Title" type="text"/>
</div>
</form>
</div>
<div className="col-lg-6">
<form>
<div className="mb-3">
<label className="form-label" htmlFor="meta-tag">Meta Tag Keyword</label>
<input className="form-control" id="meta-tag" placeholder="Enter word" type="text"/>
</div>
</form>
</div>
<div className="col-lg-6">
<form>
<div className="mb-3">
<label className="form-label" htmlFor="themes">Store Themes</label>
<select className="form-control" data-choices="" data-choices-groups="" data-placeholder="Select Themes" id="themes">
<option value="">Default</option>
<option value="Dark">Dark</option>
<option value="Minimalist">Minimalist</option>
<option value="High Contrast">High Contrast</option>
</select>
</div>
</form>
</div>
<div className="col-lg-6">
<form>
<div className="mb-3">
<label className="form-label" htmlFor="layout">Layout</label>
<select className="form-control" data-choices="" data-choices-groups="" data-placeholder="Select Layout" id="layout">
<option value="">Default</option>
<option value="Electronics">Electronics</option>
<option value="Fashion">Fashion</option>
<option value="Dining">Dining</option>
<option value="Interior">Interior</option>
<option value="Home">Home</option>
</select>
</div>
</form>
</div>
<div className="col-lg-12">
<div className="">
<label className="form-label" htmlFor="description">Description</label>
<textarea className="form-control bg-light-subtle" id="description" placeholder="Type description" rows="4"></textarea>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div className="row mb-4">
<div className="col-lg-12">
<div className="card">
<div className="card-header">
<h4 className="card-title d-flex align-items-center gap-1"><iconify-icon className="text-primary fs-20" icon="solar:shop-2-bold-duotone"></iconify-icon>Store Settings</h4>
</div>
<div className="card-body">
<div className="row">
<div className="col-lg-6">
<form>
<div className="mb-3">
<label className="form-label" htmlFor="store-name">Store Name</label>
<input className="form-control" id="store-name" placeholder="Enter name" type="text"/>
</div>
</form>
</div>
<div className="col-lg-6">
<form>
<div className="mb-3">
<label className="form-label" htmlFor="owner-name">Store Owner Full Name</label>
<input className="form-control" id="owner-name" placeholder="Full name" type="text"/>
</div>
</form>
</div>
<div className="col-lg-6">
<div className="mb-3">
<label className="form-label" htmlFor="schedule-number">Owner Phone number</label>
<input className="form-control" id="schedule-number" name="schedule-number" placeholder="Number" type="number"/>
</div>
</div>
<div className="col-lg-6">
<form>
<div className="mb-3">
<label className="form-label" htmlFor="schedule-email">Owner Email</label>
<input className="form-control" id="schedule-email" name="schedule-email" placeholder="Email" type="email"/>
</div>
</form>
</div>
<div className="col-lg-12">
<div className="mb-3">
<label className="form-label" htmlFor="address">Full Address</label>
<textarea className="form-control bg-light-subtle" id="address" placeholder="Type address" rows="3"></textarea>
</div>
</div>
<div className="col-lg-4">
<form>
<div className="mb-3">
<label className="form-label" htmlFor="your-zipcode">Zip-Code</label>
<input className="form-control" id="your-zipcode" placeholder="zip-code" type="number"/>
</div>
</form>
</div>
<div className="col-lg-4">
<form>
<div className="mb-3">
<label className="form-label" htmlFor="choices-city">City</label>
<select className="form-control" data-choices="" data-choices-groups="" data-placeholder="Select City" id="choices-city" name="choices-city">
<option value="">Choose a city</option>
<optgroup label="UK">
<option value="London">London</option>
<option value="Manchester">Manchester</option>
<option value="Liverpool">Liverpool</option>
</optgroup>
<optgroup label="FR">
<option value="Paris">Paris</option>
<option value="Lyon">Lyon</option>
<option value="Marseille">Marseille</option>
</optgroup>
<optgroup disabled="" label="DE">
<option value="Hamburg">Hamburg</option>
<option value="Munich">Munich</option>
<option value="Berlin">Berlin</option>
</optgroup>
<optgroup label="US">
<option value="New York">New York</option>
<option disabled="" value="Washington">
                                                                           Washington
                                                                      </option>
<option value="Michigan">Michigan</option>
</optgroup>
<optgroup label="SP">
<option value="Madrid">Madrid</option>
<option value="Barcelona">Barcelona</option>
<option value="Malaga">Malaga</option>
</optgroup>
<optgroup label="CA">
<option value="Montreal">Montreal</option>
<option value="Toronto">Toronto</option>
<option value="Vancouver">Vancouver</option>
</optgroup>
</select>
</div>
</form>
</div>
<div className="col-lg-4">
<form>
<label className="form-label" htmlFor="choices-country">Country</label>
<select className="form-control" data-choices="" data-choices-groups="" data-placeholder="Select Country" id="choices-country" name="choices-country">
<option value="">Choose a country</option>
<optgroup label="">
<option value="">United Kingdom</option>
<option value="Fran">France</option>
<option value="Netherlands">Netherlands</option>
<option value="U.S.A">U.S.A</option>
<option value="Denmark">Denmark</option>
<option value="Canada">Canada</option>
<option value="Australia">Australia</option>
<option value="India">India</option>
<option value="Germany">Germany</option>
<option value="Spain">Spain</option>
<option value="United Arab Emirates">United Arab Emirates</option>
</optgroup>
</select>
</form>
</div>
</div>
</div>
</div>
</div>
</div>
<div className="row mb-4">
<div className="col-lg-12">
<div className="card">
<div className="card-header">
<h4 className="card-title d-flex align-items-center gap-1"><iconify-icon className="text-primary fs-20" icon="solar:compass-bold-duotone"></iconify-icon>Localization Settings</h4>
</div>
<div className="card-body">
<div className="row">
<div className="col-lg-6">
<form>
<div className="mb-3">
<label className="form-label" htmlFor="choices-country1">Country</label>
<select className="form-control" data-choices="" data-choices-groups="" data-placeholder="Select Country" id="choices-country1" name="choices-country">
<option value="">Choose a country</option>
<optgroup label="">
<option value="">United Kingdom</option>
<option value="Fran">France</option>
<option value="Netherlands">Netherlands</option>
<option value="U.S.A">U.S.A</option>
<option value="Denmark">Denmark</option>
<option value="Canada">Canada</option>
<option value="Australia">Australia</option>
<option value="India">India</option>
<option value="Germany">Germany</option>
<option value="Spain">Spain</option>
<option value="United Arab Emirates">United Arab Emirates</option>
</optgroup>
</select>
</div>
</form>
</div>
<div className="col-lg-6">
<form>
<div className="mb-3">
<label className="form-label" htmlFor="choices-language">Language</label>
<select className="form-control" data-choices="" data-choices-groups="" data-placeholder="Select language" id="choices-language" name="choices-language">
<option value="">English</option>
<optgroup label="">
<option value="">Russian</option>
<option value="Arabic">Arabic</option>
<option value="Spanish">Spanish</option>
<option value="Turkish">Turkish</option>
<option value="German">German</option>
<option value="Armenian">Armenian</option>
<option value="Italian">Italian</option>
<option value="Catalßn">Catalßn</option>
<option value="Hindi">Hindi</option>
<option value="Japanese">Japanese</option>
<option value="French">French</option>
</optgroup>
</select>
</div>
</form>
</div>
<div className="col-lg-6">
<form>
<div className="mb-3">
<label className="form-label" htmlFor="choices-currency">Currency</label>
<select className="form-control" data-choices="" data-choices-groups="" data-placeholder="Select Currency" id="choices-currency" name="choices-currency">
<option value="">Us Dollar</option>
<optgroup label="">
<option value="">Pound</option>
<option value="Indian Rupee">Indian Rupee</option>
<option value="Euro">Euro</option>
<option value="Australian Dollar">Australian Dollar</option>
<option value="Japanese Yen">Japanese Yen</option>
<option value="Korean Won">Korean Won</option>
</optgroup>
</select>
</div>
</form>
</div>
<div className="col-lg-6">
<form>
<div className="mb-3">
<label className="form-label" htmlFor="choices-length">Length Class</label>
<select className="form-control" data-choices="" data-choices-groups="" data-placeholder="Select Length" id="choices-length" name="choices-length">
<option value="">Centimeter</option>
<optgroup label="">
<option value="">Millimeter</option>
<option value="Inch">Inch</option>
</optgroup>
</select>
</div>
</form>
</div>
<div className="col-lg-6">
<form>
<div className="">
<label className="form-label" htmlFor="choices-weight">Weight Class</label>
<select className="form-control" data-choices="" data-choices-groups="" data-placeholder="Select Weight" id="choices-weight" name="choices-weight">
<option value="">Kilogram</option>
<optgroup label="">
<option value="">Gram</option>
<option value="Pound">Pound</option>
<option value="Ounce">Ounce</option>
</optgroup>
</select>
</div>
</form>
</div>
</div>
</div>
</div>
</div>
</div>
<div className="row mb-4">
<div className="col-lg-3">
<div className="card">
<div className="card-header">
<h4 className="card-title d-flex align-items-center gap-1"><iconify-icon className="text-primary fs-20" icon="solar:box-bold-duotone"></iconify-icon>Categories Settings</h4>
</div>
<div className="card-body">
<p>Category Product Count </p>
<div className="d-flex gap-2 align-items-center mb-3">
<div className="form-check">
<input defaultChecked={true} className="form-check-input" id="flexRadioDefault1" name="flexRadioDefault" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault1">
                                                       Yes
                                                  </label>
</div>
<div className="form-check">
<input className="form-check-input" id="flexRadioDefault2" name="flexRadioDefault" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault2">
                                                       No
                                                  </label>
</div>
</div>
<form>
<div className="mb-1 pb-1">
<label className="form-label" htmlFor="items-par-page">Default Items Per Page</label>
<input className="form-control" id="items-par-page" placeholder="000" type="number"/>
</div>
</form>
</div>
</div>
</div>
<div className="col-lg-3">
<div className="card">
<div className="card-header">
<h4 className="card-title d-flex align-items-center gap-1"><iconify-icon className="text-primary fs-20" icon="solar:chat-square-check-bold-duotone"></iconify-icon>Reviews Settings</h4>
</div>
<div className="card-body">
<p>Allow Reviews </p>
<div className="d-flex gap-2 align-items-center mb-3">
<div className="form-check">
<input defaultChecked={true} className="form-check-input" id="flexRadioDefault3" name="flexRadioDefault2" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault3">
                                                       Yes
                                                  </label>
</div>
<div className="form-check">
<input className="form-check-input" id="flexRadioDefault4" name="flexRadioDefault2" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault4">
                                                       No
                                                  </label>
</div>
</div>
<p className="mt-3 pt-1">Allow Guest Reviews </p>
<div className="d-flex gap-2 align-items-center mb-2">
<div className="form-check">
<input className="form-check-input" id="flexRadioDefault5" name="flexRadioDefault3" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault5">
                                                       Yes
                                                  </label>
</div>
<div className="form-check">
<input defaultChecked={true} className="form-check-input" id="flexRadioDefault6" name="flexRadioDefault3" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault6">
                                                       No
                                                  </label>
</div>
</div>
</div>
</div>
</div>
<div className="col-lg-3">
<div className="card">
<div className="card-header">
<h4 className="card-title d-flex align-items-center gap-1"><iconify-icon className="text-primary fs-20" icon="solar:ticket-bold-duotone"></iconify-icon>Vouchers Settings</h4>
</div>
<div className="card-body">
<form>
<div className="mb-3">
<label className="form-label" htmlFor="min-vouchers">Minimum Vouchers</label>
<input className="form-control" id="min-vouchers" placeholder="000" type="number" value="1"/>
</div>
</form>
<form>
<div className="">
<label className="form-label" htmlFor="mex-vouchers">Maximum Vouchers</label>
<input className="form-control" id="mex-vouchers" placeholder="000" type="number" value="12"/>
</div>
</form>
</div>
</div>
</div>
<div className="col-lg-3">
<div className="card">
<div className="card-header">
<h4 className="card-title d-flex align-items-center gap-1"><iconify-icon className="text-primary fs-20" icon="solar:ticket-sale-bold-duotone"></iconify-icon>Tax Settings</h4>
</div>
<div className="card-body">
<p>Prices with Tax</p>
<div className="d-flex gap-2 align-items-center mb-3">
<div className="form-check">
<input defaultChecked={true} className="form-check-input" id="flexRadioDefault7" name="flexRadioDefault4" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault7">
                                                       Yes
                                                  </label>
</div>
<div className="form-check">
<input className="form-check-input" id="flexRadioDefault8" name="flexRadioDefault4" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault8">
                                                       No
                                                  </label>
</div>
</div>
<form>
<div className="mb-1 pb-1">
<label className="form-label" htmlFor="items-tax">Default Tax Rate</label>
<input className="form-control" id="items-tax" placeholder="000" type="text" value="18%"/>
</div>
</form>
</div>
</div>
</div>
</div>
<div className="row mb-4">
<div className="col-lg-12">
<div className="card">
<div className="card-header">
<h4 className="card-title d-flex align-items-center gap-1"><iconify-icon className="text-primary fs-20" icon="solar:users-group-two-rounded-bold-duotone"></iconify-icon>Customers Settings</h4>
</div>
<div className="card-body">
<div className="row justify-content-between g-3">
<div className="col-lg-2 border-end">
<p>Customers Online</p>
<div className="d-flex gap-2 align-items-center">
<div className="form-check">
<input defaultChecked={true} className="form-check-input" id="flexRadioDefault9" name="flexRadioDefault5" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault9">
                                                                 Yes
                                                            </label>
</div>
<div className="form-check">
<input className="form-check-input" id="flexRadioDefault10" name="flexRadioDefault5" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault10">
                                                                 No
                                                            </label>
</div>
</div>
</div>
<div className="col-lg-2 border-end">
<p>Customers Activity</p>
<div className="d-flex gap-2 align-items-center">
<div className="form-check">
<input defaultChecked={true} className="form-check-input" id="flexRadioDefault11" name="flexRadioDefault6" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault11">
                                                                 Yes
                                                            </label>
</div>
<div className="form-check">
<input className="form-check-input" id="flexRadioDefault12" name="flexRadioDefault6" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault12">
                                                                 No
                                                            </label>
</div>
</div>
</div>
<div className="col-lg-2 border-end">
<p>Customer Searches</p>
<div className="d-flex gap-2 align-items-center">
<div className="form-check">
<input defaultChecked={true} className="form-check-input" id="flexRadioDefault13" name="flexRadioDefault7" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault13">
                                                                 Yes
                                                            </label>
</div>
<div className="form-check">
<input className="form-check-input" id="flexRadioDefault14" name="flexRadioDefault7" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault14">
                                                                 No
                                                            </label>
</div>
</div>
</div>
<div className="col-lg-2 border-end">
<p>Allow Guest Checkout</p>
<div className="d-flex gap-2 align-items-center">
<div className="form-check">
<input className="form-check-input" id="flexRadioDefault15" name="flexRadioDefault8" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault15">
                                                                 Yes
                                                            </label>
</div>
<div className="form-check">
<input defaultChecked={true} className="form-check-input" id="flexRadioDefault16" name="flexRadioDefault8" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault16">
                                                                 No
                                                            </label>
</div>
</div>
</div>
<div className="col-lg-2">
<p>Login Display Price</p>
<div className="d-flex gap-2 align-items-center">
<div className="form-check">
<input className="form-check-input" id="flexRadioDefault17" name="flexRadioDefault9" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault17">
                                                                 Yes
                                                            </label>
</div>
<div className="form-check">
<input defaultChecked={true} className="form-check-input" id="flexRadioDefault18" name="flexRadioDefault9" type="radio"/>
<label className="form-check-label" htmlFor="flexRadioDefault18">
                                                                 No
                                                            </label>
</div>
</div>
</div>
</div>
<div className="row mt-3">
<div className="col-lg-6">
<form>
<div className="">
<label className="form-label" htmlFor="login-attempts">Max Login Attempts</label>
<input className="form-control" id="login-attempts" placeholder="max" type="text" value="1 hour"/>
</div>
</form>
</div>
</div>
</div>
</div>
</div>
</div>
<div className="text-end mt-3">
<a className="btn btn-danger me-1" href="#!">Cancel</a>
<a className="btn btn-success" href="#!">Save Change</a>
</div>
    </>
  );
}
