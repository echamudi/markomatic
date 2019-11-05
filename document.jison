%lex

%%
\{\>                                    { return '{>';}
\{\=                                    { return '{=';}
\<\!\-\-                                { return '<!--';}
\-\-\>                                  { return '-->';}
\}                                      { return '}';}
<<EOF>>                                 { return 'EOF'}
[^({=)^({>)^(})^(\<\!\-\-)^(\-\-\>)]+   { return 'TEXT'; }

/lex

%start document
%%

document
    : content EOF
        { return $1 }
    ;

content
    : template
        { $$ = [$1] }
    | TEXT
        { $$ = [$1] }
    | template content
        { $$ = [$1, ...$2] }
    | TEXT content
        { $$ = [$1, ...$2] }
    ;

template
    : '{>' TEXT '}'
        { $$ = { k: 'command', v: $2, d: @$} }
    | '<!--' TEXT '-->'
        { $$ = { k: 'switch', v: $2, d: @$} }
    | '{=' TEXT '}'
        { $$ = { k: 'print', v: $2, d: @$} }
    ;
