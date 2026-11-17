# Menu catalogue, prices and pictures

## Requirement

The menu includes food, drinks and merchandise from 20 reference screenshots. Set-meal drink options follow the reference catalogue and recording. Obscured prices and some supplements use the estimates listed below.

## Delivered behaviour

- 74 items across Sets, Hot beverages, Cold beverages, Toast, Toastwich and Merchandise.
- 73 items display pictures taken from the supplied screenshots. The existing soft-boiled egg side uses its original icon.
- Categories are selectable from a labelled menu dropdown.
- Set meals use a drink selector with the corresponding supplement. Standalone hot and cold drinks have their own prices.
- Quantities multiply the complete item price, including the selected set drink.
- Demo participant orders use current catalogue prices.
- Loading an older order into a new cart uses current catalogue names and prices. Original historical receipts retain their recorded values.
- The Milo-unavailable demo also catches Iced Milo, Moki and sets with Milo selected.

## Price assumptions for review

| Item or option | Value used | Basis |
| --- | --- | --- |
| Set D French Toast Set | $6.30 | Estimated from the other standard toast sets because the screenshot partly hides the price |
| Set E Smoked Cheese French Toast Set | $6.70 | Estimated from the premium toast option and partly visible price |
| Kaya Pistachio Cookies | $4.50 | Lower edge is partly obscured, matching the adjacent cookie pack |
| Soft-boiled Eggs (2) | $1.80 | Retained from the existing prototype because this side is absent from the supplied catalogue screenshots |
| Hot Yuan Yang Large supplement | +$0.90 | Inferred from the regular surcharge and neighbouring large drink supplements |
| Hot Coffee C Regular / Large supplements | +$0.20 / +$1.00 | Inferred from Coffee / Tea C equivalents |
| Hot Tea C Regular supplement | +$0.20 | Inferred from Coffee C and the large Tea C option |
| Iced Coffee C and Tea C Regular / Large supplements | +$1.20 / +$2.30 | Inferred from the adjacent C drink prices |
| Iced Yuan Yang C Regular / Large supplements | +$1.30 / +$2.40 | Inferred from the Yuan Yang and C drink differences |
| Iced Soya Coffee O and Iced Soya Tea O Regular supplements | +$1.50 each | Inferred from their screenshot prices and neighbouring soya drink supplements |

These values are project demo assumptions. The supplied screenshots show the 1 Raffles Place menu. The prototype applies this catalogue to its demo outlets.

The Silkyz Barley cards include the supplied egg-white and after-10am notes. Time-of-day availability for those products is descriptive in this MVP. Stock changes are controlled by the demo controls.

## Pictures

The original screenshots are stored in frontend/public/menu/source-01.jpg through source-20.jpg. Each catalogue entry specifies its picture region. CSS displays that region so the product pictures stay faithful to the source. Source placeholders for Peanut Toast and Ginger Tea O are retained.

## Verification

- Production build and diff formatting checks passed.
- Component flow checks passed for all 74 items through category selection, quantity, cart, submission and checkout.
- Catalogue checks confirmed unique item IDs, unique drink options and local picture files.
- Legacy reorder checks confirmed current prices, including mapping an old iced coffee order to the cold-drink entry.
- Historical receipt checks confirmed original prices remain recorded.
- A stock regression check confirmed a set containing Iced Milo blocks checkout when Milo becomes unavailable.
- Browser review covered set, beverage and merchandise pictures.
- A browser checkout of two Set A meals with Iced Milo, one Iced Coffee and one Kaya Jar totalled $25.20. The mock card receipt and collected order history also showed $25.20 and the chosen options. With one member, collection credited 201 points.

## Manual acceptance

1. Refresh the preview, sign in and browse each menu category.
2. Start a group and add Set A with Iced Milo Regular. Check $7.60 for one set and $15.20 for two.
3. Add Iced Coffee for $3.20 and Kaya Jar for $6.80. Check a cart total of $25.20.
4. Submit, confirm the mock card, close ordering and send. Check the same amount under Pay.
5. Advance the outlet status, mark collected and inspect history for the items, options and total.
6. Start another group and load an older order. Check the new cart uses the updated menu prices.

## Catalogue

| Category | Item | Price | Picture source |
| --- | --- | --- | --- |
| Sets | Set A - Kaya Toast Set (Kaya & Sliced Butter) | $6.30 | source-01.jpg |
| Sets | Set B - Kaya Peanut Set (Kaya & Creamy Peanut) | $6.30 | source-01.jpg |
| Sets | Set B2 - Peanut Toast Set (Creamy Peanut only) | $6.30 | source-02.jpg |
| Sets | Set C - Butter Sugar Toast Set | $6.30 | source-02.jpg |
| Sets | Set D - French Toast Set (with Kaya Dip) | $6.30 | source-02.jpg |
| Sets | Set E - Smoked Cheese French Toast Set (with Kaya Dip) | $6.70 | source-02.jpg |
| Sets | Set F1 - Steamed Bread Set (Kaya & Sliced Butter) | $6.40 | source-03.jpg |
| Sets | Set F2 - Steamed Bread Set (Kaya & Creamy Peanut) | $6.40 | source-03.jpg |
| Hot beverages | Soya Milk Coffee | $3.50 | source-04.jpg |
| Hot beverages | Soya Milk Coffee O | $3.30 | source-04.jpg |
| Hot beverages | Soya Milk Tea | $3.50 | source-04.jpg |
| Hot beverages | Soya Milk Tea O | $3.30 | source-04.jpg |
| Hot beverages | Coffee O | $2.00 | source-05.jpg |
| Hot beverages | Tea O | $2.00 | source-05.jpg |
| Hot beverages | Yuan Yang O | $2.10 | source-05.jpg |
| Hot beverages | Coffee | $2.20 | source-05.jpg |
| Hot beverages | Tea | $2.20 | source-06.jpg |
| Hot beverages | Yuan Yang | $2.30 | source-06.jpg |
| Hot beverages | Coffee C | $2.40 | source-06.jpg |
| Hot beverages | Tea C | $2.40 | source-06.jpg |
| Hot beverages | Yuan Yang C | $2.50 | source-07.jpg |
| Hot beverages | Milo | $2.60 | source-07.jpg |
| Hot beverages | Horlicks | $2.60 | source-07.jpg |
| Hot beverages | Lemon Tea | $3.30 | source-07.jpg |
| Hot beverages | Buzzy Honey Lemon | $3.30 | source-08.jpg |
| Hot beverages | Silkyz Barley | $3.50 | source-08.jpg |
| Hot beverages | Ginger Tea O | $2.90 | source-08.jpg |
| Hot beverages | Ginger Water | $2.90 | source-08.jpg |
| Hot beverages | Ginger Milk Tea | $3.00 | source-09.jpg |
| Hot beverages | Chinese Tea | $2.40 | source-09.jpg |
| Cold beverages | Iced Moki | $3.60 | source-09.jpg |
| Cold beverages | Iced Coffee O | $3.10 | source-09.jpg |
| Cold beverages | Iced Tea O | $3.10 | source-10.jpg |
| Cold beverages | Iced Yuan Yang O | $3.20 | source-10.jpg |
| Cold beverages | Iced Coffee | $3.20 | source-10.jpg |
| Cold beverages | Iced Tea | $3.20 | source-10.jpg |
| Cold beverages | Iced Yuan Yang | $3.30 | source-11.jpg |
| Cold beverages | Iced Coffee C | $3.40 | source-11.jpg |
| Cold beverages | Iced Tea C | $3.40 | source-11.jpg |
| Cold beverages | Iced Yuan Yang C | $3.50 | source-11.jpg |
| Cold beverages | Iced Milo | $3.50 | source-12.jpg |
| Cold beverages | Iced Horlicks | $3.50 | source-12.jpg |
| Cold beverages | Iced Lemon Tea | $3.30 | source-12.jpg |
| Cold beverages | Iced Honey Lemon | $3.30 | source-12.jpg |
| Cold beverages | Iced Silkyz Barley | $3.50 | source-13.jpg |
| Cold beverages | Iced Ginger Milk Tea | $3.70 | source-13.jpg |
| Cold beverages | Iced Soya Coffee O | $3.70 | source-13.jpg |
| Cold beverages | Iced Soya Coffee | $4.00 | source-13.jpg |
| Cold beverages | Iced Soya Tea O | $3.70 | source-14.jpg |
| Cold beverages | Iced Soya Tea | $4.00 | source-14.jpg |
| Toast | Kaya Toast (Kaya & Sliced Butter) | $3.00 | source-14.jpg |
| Toast | Kaya Peanut (Kaya & Creamy Peanut) | $3.00 | source-14.jpg |
| Toast | Peanut Toast (Without Kaya) | $3.00 | source-15.jpg |
| Toast | Butter Sugar Toast | $3.00 | source-15.jpg |
| Toast | French Toast (with Kaya Dip) | $3.00 | source-15.jpg |
| Toast | Smoked Cheese French Toast (with Kaya Dip) | $3.50 | source-15.jpg |
| Toast | Steamed Bread (Kaya & Sliced Butter) | $3.20 | source-16.jpg |
| Toast | Steamed Bread (Kaya & Creamy Peanut) | $3.20 | source-16.jpg |
| Toast | Soft-boiled Eggs (2) | $1.80 | Existing icon |
| Toastwich | Chilli Crab Toastwich (With Real Crab Meat) | $5.80 | source-16.jpg |
| Toastwich | Egg Mayo Toastwich | $4.80 | source-16.jpg |
| Toastwich | Chicken Char Siew Toastwich | $5.20 | source-17.jpg |
| Toastwich | Specialty Otah Toastwich (Otah, Omelette & Sambal) | $5.20 | source-17.jpg |
| Toastwich | Tuna Mayo Toastwich | $4.80 | source-17.jpg |
| Toastwich | Rendang Chicken Toastwich | $5.20 | source-17.jpg |
| Merchandise | Black Tea (250g) | $12.80 | source-18.jpg |
| Merchandise | Chunky Peanut Butter | $7.20 | source-18.jpg |
| Merchandise | Kaya Jar (290g) | $6.80 | source-19.jpg |
| Merchandise | Single Gift Pack (290g) | $8.20 | source-19.jpg |
| Merchandise | Elfin Pack (75g x 2) | $8.80 | source-19.jpg |
| Merchandise | Peanut Butter (250g) | $6.80 | source-19.jpg |
| Merchandise | Coffee Powder (500g) | $24.80 | source-20.jpg |
| Merchandise | Kaya Butter Cookies | $4.50 | source-20.jpg |
| Merchandise | Kaya Pistachio Cookies | $4.50 | source-20.jpg |

## Set-meal drink supplements

| Drink | Additional price |
| --- | --- |
| Hot Coffee O (Regular) | $0.00 |
| Hot Coffee O (Large) | $0.60 |
| Hot Tea O (Regular) | $0.00 |
| Hot Tea O (Large) | $0.60 |
| Hot Yuan Yang O (Regular) | $0.00 |
| Hot Yuan Yang O (Large) | $0.70 |
| Hot Coffee (Regular) | $0.00 |
| Hot Coffee (Large) | $0.80 |
| Hot Tea (Regular) | $0.00 |
| Hot Tea (Large) | $0.80 |
| Hot Yuan Yang (Regular) | $0.10 |
| Hot Yuan Yang (Large) | $0.90 |
| Hot Coffee C (Regular) | $0.20 |
| Hot Coffee C (Large) | $1.00 |
| Hot Tea C (Regular) | $0.20 |
| Hot Tea C (Large) | $1.00 |
| Hot Yuan Yang C (Regular) | $0.30 |
| Hot Yuan Yang C (Large) | $1.10 |
| Hot Buzzy Honey Lemon (Large) | $1.10 |
| Hot Lemon Tea (Large) | $1.10 |
| Hot Silkyz Barley (Large) | $1.30 |
| Hot Milo (Regular) | $0.40 |
| Hot Milo (Large) | $1.20 |
| Hot Horlicks (Regular) | $0.40 |
| Hot Horlicks (Large) | $1.20 |
| Hot Ginger Tea O (Regular) | $0.70 |
| Hot Ginger Tea O (Large) | $1.40 |
| Iced Coffee O (Regular) | $0.90 |
| Iced Coffee O (Large) | $2.00 |
| Iced Tea O (Regular) | $0.90 |
| Iced Tea O (Large) | $2.00 |
| Iced Yuan Yang O (Regular) | $1.00 |
| Iced Yuan Yang O (Large) | $2.10 |
| Iced Coffee (Regular) | $1.00 |
| Iced Coffee (Large) | $2.10 |
| Iced Tea (Regular) | $1.00 |
| Iced Tea (Large) | $2.10 |
| Iced Yuan Yang (Regular) | $1.10 |
| Iced Yuan Yang (Large) | $2.20 |
| Iced Coffee C (Regular) | $1.20 |
| Iced Coffee C (Large) | $2.30 |
| Iced Tea C (Regular) | $1.20 |
| Iced Tea C (Large) | $2.30 |
| Iced Yuan Yang C (Regular) | $1.30 |
| Iced Yuan Yang C (Large) | $2.40 |
| Iced Milo (Regular) | $1.30 |
| Iced Milo (Large) | $2.50 |
| Iced Horlicks (Regular) | $1.30 |
| Iced Horlicks (Large) | $2.50 |
| Iced Lemon Tea (Regular) | $1.10 |
| Iced Lemon Tea (Large) | $2.20 |
| Iced Honey Lemon (Regular) | $1.10 |
| Iced Honey Lemon (Large) | $2.20 |
| Iced Silkyz Barley (Regular) | $1.30 |
| Iced Silkyz Barley (Large) | $2.60 |
| Iced Ginger Milk Tea (Regular) | $1.50 |
| Iced Ginger Milk Tea (Large) | $2.70 |
| Iced Soya Coffee O (Regular) | $1.50 |
| Iced Soya Coffee (Regular) | $1.80 |
| Iced Soya Coffee (Large) | $3.00 |
| Iced Soya Tea O (Regular) | $1.50 |
| Iced Soya Tea (Regular) | $1.80 |
| Iced Soya Tea (Large) | $3.00 |
| Iced Moki (Regular) | $1.40 |
| Soya Milk Coffee (Large) | $1.30 |
| Soya Milk Coffee O (Large) | $1.10 |
| Soya Milk Tea (Large) | $1.30 |
| Soya Milk Tea O (Large) | $1.30 |
