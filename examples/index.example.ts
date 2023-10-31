import { diff, redo, undo, Diff } from '../src'

const curr = {
  codesjson: {
    kind: 'folder',
    tree: {
      Fragments: {
        kind: 'file',
        imports: [
          {
            from: '@Moduler/jawad/Simple/1.0.0/Index',
            clauses: [{ prop: 'Moduler', dec: 'Moduler' }],
          },
          {
            from: '@Moduler/jawad/Simple/1.0.0/Props',
            clauses: [{ prop: 'ModulerProps', dec: 'ModulerProps' }],
          },
          {
            from: '@Component/jawad/Fragmenter/1.0.0/Index',
            clauses: [{ prop: 'Fragmenter', dec: 'Fragmenter' }],
          },
          {
            from: '@Fragment/jawad/Newo/2.0.0/Index',
            clauses: [{ prop: 'Fragment', dec: 'Newo_A7CB5' }],
          },
          {
            from: '@Fragment/jawad/Newo/2.0.0/Props',
            clauses: [{ prop: 'FragmentProps', dec: 'Newo_A7CB5_Props' }],
          },
        ],
        block: [
          {
            kind: 'variable',
            exported: false,
            binding: { kind: 'identifier', name: 'fragComps' },
            initializer: {
              kind: 'object',
              props: [
                {
                  kind: 'assign',
                  name: 'Newo_A7CB5',
                  initializer: { kind: 'identifier', name: 'Newo_A7CB5' },
                },
              ],
            },
          },
          {
            kind: 'variable',
            exported: false,
            binding: { kind: 'identifier', name: 'fragmap' },
            initializer: {
              kind: 'array',
              elms: [
                {
                  kind: 'assign',
                  elm: {
                    kind: 'object',
                    props: [
                      {
                        kind: 'assign',
                        name: 'frag',
                        initializer: { kind: 'static', value: 'Newo_A7CB5' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'variable',
            exported: true,
            binding: { kind: 'identifier', name: 'Fragments' },
            initializer: {
              kind: 'arrowfunc',
              params: [
                {
                  binding: { kind: 'identifier', name: 'scopes' },
                  spread: false,
                  initializer: { kind: 'static' },
                },
              ],
              run: [
                {
                  kind: 'return',
                  value: {
                    kind: 'callexp',
                    access: { kind: 'identifier', name: 'Fragmenter' },
                    args: [
                      {
                        kind: 'object',
                        props: [
                          {
                            kind: 'assign',
                            name: 'scopes',
                            initializer: { kind: 'identifier', name: 'scopes' },
                          },
                          {
                            kind: 'assign',
                            name: 'fragComps',
                            initializer: { kind: 'identifier', name: 'fragComps' },
                          },
                          {
                            kind: 'assign',
                            name: 'fragmap',
                            initializer: { kind: 'identifier', name: 'fragmap' },
                          },
                          {
                            kind: 'assign',
                            name: 'Moduler',
                            initializer: { kind: 'identifier', name: 'Moduler' },
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
        typeblock: [
          {
            name: 'ModulerScopes',
            extend: [],
            prop: {
              kind: 'simgroup',
              group: {
                kind: 'grprops',
                props: { moduler: { kind: 'bind', name: 'ModulerProps' } },
              },
            },
          },
          {
            name: 'FragmentProps',
            extend: ['ModulerScopes'],
            prop: {
              kind: 'simgroup',
              group: {
                kind: 'grprops',
                props: { Newo_A7CB5: { kind: 'bind', name: 'Newo_A7CB5_Props' } },
              },
              exported: true,
            },
          },
        ],
      },
      Index: {
        kind: 'file',
        imports: [
          {
            from: './Fragments',
            clauses: [
              { prop: 'Fragments', dec: 'Fragments' },
              { prop: 'FragmentProps', dec: 'FragmentProps' },
            ],
          },
        ],
        block: [
          {
            kind: 'variable',
            exported: true,
            binding: { kind: 'identifier', name: 'Module' },
            initializer: {
              kind: 'arrowfunc',
              params: [
                { binding: { kind: 'identifier', name: 'props' }, initializer: { kind: 'static' } },
              ],
              run: [
                {
                  kind: 'variable',
                  exported: false,
                  binding: { kind: 'identifier', name: 'scopes' },
                  initializer: {
                    kind: 'callexp',
                    access: {
                      kind: 'propaccess',
                      access: { kind: 'identifier', name: '$methods' },
                      prop: 'getScopes',
                    },
                    args: [{ kind: 'identifier', name: 'props' }],
                  },
                },
                {
                  kind: 'return',
                  value: {
                    kind: 'jsx',
                    tagkind: 'component',
                    tag: { kind: 'identifier', name: 'Fragments' },
                    attrs: [{ kind: 'spread', exp: { kind: 'identifier', name: 'scopes' } }],
                    children: [],
                  },
                },
              ],
            },
          },
        ],
        typeblock: [
          {
            name: 'Props',
            extend: ['FragmentProps'],
            prop: { kind: 'simgroup', group: { kind: 'grprops', props: {} }, exported: true },
          },
        ],
      },
    },
  },
  propsjson: {
    kind: 'simgroup',
    props: {
      moduler: { kind: 'simgroup', props: { background: { kind: 'colorkey', key: 'palette2' } } },
      Newo_YOVK1: { kind: 'simgroup', props: { num: { kind: 'static', value: 6 } } },
      Newo_79PIT: { kind: 'simgroup', props: { num: { kind: 'static', value: 8 } } },
      Newo_ETMAM: { kind: 'simgroup', props: { num: { kind: 'static', value: 6 } } },
      Newo_ZGTC6: { kind: 'simgroup', props: { num: { kind: 'static', value: 6 } } },
      Newo_QT3TS: { kind: 'simgroup', props: { num: { kind: 'static', value: 6 } } },
      ImgsNewo_U4IW4: {
        kind: 'simgroup',
        props: {
          img: {
            kind: 'image',
            imguid: '2E8ZSIFATLYMJSK',
            image: {
              reference: 'fragment-img',
              fragid: '901YWNJGQIYGEPC',
              verid: '3T43SQNKOTSNSI9',
              imghash: '0d27e88192ebb9efc375e7567d811c34',
              source: { source: 'stockImg', imgid: 'G2UQZRJYVXQTMW6' },
            },
          },
        },
      },
      Newo_BI9M5: { kind: 'simgroup', props: { num: { kind: 'static', value: 6 } } },
      Newo_B1LAC: { kind: 'simgroup', props: { num: { kind: 'static', value: 6 } } },
      Newo_58B95: { kind: 'simgroup', props: { num: { kind: 'static', value: 6 } } },
      Newo_KCQEL: { kind: 'simgroup', props: { num: { kind: 'static', value: 6 } } },
      ImgsNewo_P0X48: {
        kind: 'simgroup',
        props: {
          img: {
            kind: 'image',
            imguid: '2E8ZSIFATLYMJSK',
            image: {
              reference: 'fragment-img',
              fragid: '901YWNJGQIYGEPC',
              verid: '3T43SQNKOTSNSI9',
              imghash: '0d27e88192ebb9efc375e7567d811c34',
              source: { source: 'stockImg', imgid: 'G2UQZRJYVXQTMW6' },
            },
          },
        },
      },
      Newo_MZC05: { kind: 'simgroup', props: { num: { kind: 'static', value: 6 } } },
      ImgsNewo_8WAQ2: {
        kind: 'simgroup',
        props: {
          img: {
            kind: 'image',
            imguid: '2E8ZSIFATLYMJSK',
            image: {
              reference: 'fragment-img',
              fragid: '901YWNJGQIYGEPC',
              verid: '3T43SQNKOTSNSI9',
              imghash: '0d27e88192ebb9efc375e7567d811c34',
              source: { source: 'stockImg', imgid: 'G2UQZRJYVXQTMW6' },
            },
          },
        },
      },
      Newo_A7CB5: { kind: 'simgroup', props: { num: { kind: 'static', value: 6 } } },
    },
  },
  imguids: [],
}

const d1: Diff = [
  2,
  [
    [
      [
        ['codesjson', 'tree', 'Fragments', 'imports', 3],
        {
          from: '@Fragment/jawad/Newo/2.0.0/Index',
          clauses: [{ prop: 'Fragment', dec: 'Newo_A7CB5' }],
        },
      ],
      [
        ['codesjson', 'tree', 'Fragments', 'imports', 4],
        {
          from: '@Fragment/jawad/Newo/2.0.0/Props',
          clauses: [{ prop: 'FragmentProps', dec: 'Newo_A7CB5_Props' }],
        },
      ],
      [
        ['codesjson', 'tree', 'Fragments', 'block', 0, 'initializer', 'props', 0],
        {
          kind: 'assign',
          name: 'Newo_A7CB5',
          initializer: { kind: 'identifier', name: 'Newo_A7CB5' },
        },
      ],
      [
        ['codesjson', 'tree', 'Fragments', 'block', 1, 'initializer', 'elms', 0],
        {
          kind: 'assign',
          elm: {
            kind: 'object',
            props: [
              {
                kind: 'assign',
                name: 'frag',
                initializer: { kind: 'static', value: 'Newo_A7CB5' },
              },
            ],
          },
        },
      ],
      [
        ['codesjson', 'tree', 'Fragments', 'typeblock', 1, 'prop', 'group', 'props', 'Newo_A7CB5'],
        { kind: 'bind', name: 'Newo_A7CB5_Props' },
      ],
      [
        ['propsjson', 'props', 'Newo_A7CB5'],
        { kind: 'simgroup', props: { num: { kind: 'static', value: 6 } } },
      ],
    ],
    [],
    [],
  ],
]

console.log(undo(curr, d1))
