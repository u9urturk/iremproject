import React from 'react'

export default function OrderManagment() {
    return (
        <div className='animate-fade'>

            {/* cards */}
            <div className='flex flex-wrap justify-between items-center m-8 gap-4'>
                <div className="card bg-base-100 w-96 shadow-xl">
                    <div className="card-body flex justify-start gap-y-12">
                        <h1 className="card-title "><strong>Toplam Siparişler</strong></h1>
                        <strong className='font-bold text-4xl'> <p>5</p></strong>
                    </div>
                </div>
                <div className="card bg-base-100 w-96 shadow-xl">
                    <div className="card-body flex justify-start gap-y-12">
                        <h1 className="card-title "><strong>Toplam Gelir</strong></h1>
                        <strong className='font-bold text-4xl'> <p>659.95 ₺</p></strong>
                    </div>
                </div><div className="card bg-base-100 w-96 shadow-xl">
                    <div className="card-body flex justify-start gap-y-12">
                        <h1 className="card-title "><strong>Ortalama Sipariş Değeri</strong></h1>
                        <strong className='font-bold text-4xl'> <p>131.99 ₺</p></strong>
                    </div>
                </div>
            </div>

            {/* table */}
            <div className='flex md:flex-row gap-y-8 pt-16 md:gap-y-0 flex-col items-center justify-between my-8'>
                <h1 className='font-bold text-4xl tracking-widest text-center'><strong>Siparişler</strong></h1>
                <div className='flex dropdown  dropdown-bottom dropdown-end flex-row gap-x-4'>
                    <div><input className="input input-bordered w-full max-w-xs" type="text" placeholder='Sipariş ara...' /></div>
                    <div className='flex items-center justify-center'>
                        <div tabIndex={0} role="button" className="btn rounded-btn font-semibold  btn-outline">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="h-4 w-4"
                            >
                                <path d="m21 16-4 4-4-4"></path>
                                <path d="M17 20V4"></path>
                                <path d="m3 8 4-4 4 4"></path>
                                <path d="M7 4v16"></path>
                            </svg>Sırala</div>
                        <ul
                            tabIndex={0}
                            className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
                            <li><a>Sipariş numarası</a></li>
                            <li><a>Müşteri adı</a></li>
                            <li><a>Tarih</a></li>
                            <li><a>Toplam</a></li>
                            <li><a>Durum</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <table class="w-full caption-bottom text-sm">
                    <thead class="[&amp;_tr]:border-b">
                        <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 w-[150px]">
                                Sipariş Numarası
                            </th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                Müşteri Adı
                            </th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                                Sipariş Tarihi
                            </th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                                Durum
                            </th>
                            <th class="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right">
                                Toplam
                            </th>
                        </tr>
                    </thead>
                    <tbody class="[&amp;_tr:last-child]:border-0">
                        <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">ORD001</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">John Doe</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">2023-05-01</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                                <div
                                    class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    data-v0-t="badge"
                                >
                                    Yolda
                                </div>
                            </td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">99.99 ₺</td>
                        </tr>
                        <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">ORD002</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Jane Smith</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">2023-05-02</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                                <div
                                    class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-warning text-foreground"
                                    data-v0-t="badge"
                                >
                                    Hazırlanıyor
                                </div>
                            </td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">149.99 ₺</td>
                        </tr>
                        <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">ORD003</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Bob Johnson</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">2023-05-03</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                                <div
                                    class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-error text-destructive-foreground hover:bg-destructive/80"
                                    data-v0-t="badge"
                                >
                                    İptal edildi
                                </div>
                            </td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">79.99 ₺</td>
                        </tr>
                        <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">ORD004</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Sarah Lee</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">2023-05-04</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                                <div
                                    class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-success  text-gray-100 hover:bg-destructive/80"
                                    data-v0-t="badge"
                                >
                                    Teslim edildi
                                </div>
                            </td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">199.99 ₺</td>
                        </tr>
                        <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">ORD005</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Tom Wilson</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">2023-05-05</td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                                <div
                                    class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    data-v0-t="badge"
                                >
                                    Yolda
                                </div>
                            </td>
                            <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">$129.99</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
