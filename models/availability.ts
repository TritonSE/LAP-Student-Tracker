// import * as t from "io-ts";
//
//
// export const Availability = t.intersection([
//     t.type({
//         mon: t.union([
//             t.array(t.array(t.string)),
//             t.null
//         ]),
//         tue: t.union([
//             t.array(t.array(t.string)),
//             t.null
//         ]),
//         wed: t.union([
//             t.array(t.array(t.string)),
//             t.null
//         ]),
//         thu: t.union([
//             t.array(t.array(t.string)),
//             t.null
//         ]),
//         fri: t.union([
//             t.array(t.array(t.string)),
//             t.null
//         ]),
//         sat: t.union([
//             t.array(t.array(t.string)),
//             t.null
//         ])
//     }),
//     t.partial({
//         timeZone: t.string
//     })
// ])
//
// export interface Availability {
//     mon:
//     (
//         | Array<Array<string>>
//         | null
//     ),
//     tue:
//     (
//         | Array<Array<string>>
//         | null
//     ),
//     wed:
//     (
//         | Array<Array<string>>
//         | null
//     ),
//     thu:
//     (
//         | Array<Array<string>>
//         | null
//     ),
//     fri:
//     (
//         | Array<Array<string>>
//         | null
//     ),
//     sat:
//     (
//         | Array<Array<string>>
//         | null
//     ),
//     timeZone?: string
// }