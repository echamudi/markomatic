
/* lexical grammar */
%lex
%%
"{>"(.|\n)*?"}"                 return 'TAG_command'
"{="(.|\n)*?"}"                 return 'TAG_print'
"<!--"(.|\n)*?"-->"             return 'TAG_comment'
[^\{^\}^\<^\>^\-^\!]+		return 'WORD'
(.|\n)				return 'CHAR'
<<EOF>>				return 'EOF'


/lex

%start html

%% /* language grammar */

html
 : contents EOF
     {return $1;}
 ;

contents
 : content
	{$$ = $1;}
 | contents content
	{$$ =  $1 + $2;}
 ;

content
	: TAG_command
		{ $$ = yytext; }
	| TAG_print
		{ $$ = yytext; }
	| TAG_comment
		{ $$ = yytext; }
	| CHAR
		{ $$ = yytext; }
	| WORD
		{ $$ = yytext; }
 ;