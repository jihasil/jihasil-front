import { BlockquoteElementStatic } from "@/app/(front)/components/plate-ui/blockquote-element-static";
import { CodeBlockElementStatic } from "@/app/(front)/components/plate-ui/code-block-element-static";
import { CodeLeafStatic } from "@/app/(front)/components/plate-ui/code-leaf-static";
import { CodeLineElementStatic } from "@/app/(front)/components/plate-ui/code-line-element-static";
import { CodeSyntaxLeafStatic } from "@/app/(front)/components/plate-ui/code-syntax-leaf-static";
import { ColumnElementStatic } from "@/app/(front)/components/plate-ui/column-element-static";
import { ColumnGroupElementStatic } from "@/app/(front)/components/plate-ui/column-group-element-static";
import { CommentLeafStatic } from "@/app/(front)/components/plate-ui/comment-leaf-static";
import { DateElementStatic } from "@/app/(front)/components/plate-ui/date-element-static";
import {
  BaseEquationPlugin,
  BaseInlineEquationPlugin,
} from "@udecode/plate-math";
import { EquationElementStatic } from "@/app/(front)/components/plate-ui/equation-element-static";
import { MediaFileElementStatic } from "@/app/(front)/components/plate-ui/media-file-element-static";
import { BaseHighlightPlugin } from "@udecode/plate-highlight";
import { HighlightLeafStatic } from "@/app/(front)/components/plate-ui/highlight-leaf-static";
import { BaseHorizontalRulePlugin } from "@udecode/plate-horizontal-rule";
import { HrElementStatic } from "@/app/(front)/components/plate-ui/hr-element-static";
import { ImageElementStatic } from "@/app/(front)/components/plate-ui/image-element-static";
import { InlineEquationElementStatic } from "@/app/(front)/components/plate-ui/inline-equation-element-static";
import { BaseKbdPlugin } from "@udecode/plate-kbd";
import { KbdLeafStatic } from "@/app/(front)/components/plate-ui/kbd-leaf-static";
import { BaseLinkPlugin } from "@udecode/plate-link";
import { LinkElementStatic } from "@/app/(front)/components/plate-ui/link-element-static";
import { BaseMentionPlugin } from "@udecode/plate-mention";
import { MentionElementStatic } from "@/app/(front)/components/plate-ui/mention-element-static";
import { ParagraphElementStatic } from "@/app/(front)/components/plate-ui/paragraph-element-static";
import {
  BaseTableCellHeaderPlugin,
  BaseTableCellPlugin,
  BaseTablePlugin,
  BaseTableRowPlugin,
} from "@udecode/plate-table";
import {
  TableCellElementStatic,
  TableCellHeaderStaticElement,
} from "@/app/(front)/components/plate-ui/table-cell-element-static";
import { TableElementStatic } from "@/app/(front)/components/plate-ui/table-element-static";
import { TableRowElementStatic } from "@/app/(front)/components/plate-ui/table-row-element-static";
import {
  BaseHeadingPlugin,
  BaseTocPlugin,
  HEADING_KEYS,
  HEADING_LEVELS,
} from "@udecode/plate-heading";
import { TocElementStatic } from "@/app/(front)/components/plate-ui/toc-element-static";
import { BaseTogglePlugin } from "@udecode/plate-toggle";
import { ToggleElementStatic } from "@/app/(front)/components/plate-ui/toggle-element-static";
import { MediaVideoElementStatic } from "@/app/(front)/components/plate-ui/media-video-element-static";
import { HeadingElementStatic } from "@/app/(front)/components/plate-ui/heading-element-static";
import { BaseLineHeightPlugin } from "@udecode/plate-line-height";
import {
  BaseFontBackgroundColorPlugin,
  BaseFontColorPlugin,
  BaseFontSizePlugin,
} from "@udecode/plate-font";
import { FireLiComponent, FireMarker } from "../plate-ui/indent-fire-marker";
import {
  TodoLiStatic,
  TodoMarkerStatic,
} from "@/app/(front)/components/plate-ui/indent-todo-marker-static";
import { MediaAudioElementStatic } from "@/app/(front)/components/plate-ui/media-audio-element-static";
import { withProps } from "@udecode/cn";
import { BaseParagraphPlugin, SlateLeaf } from "@udecode/plate";
import { BaseIndentPlugin } from "@udecode/plate-indent";
import { BaseAlignPlugin } from "@udecode/plate-alignment";
import {
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
  BaseSubscriptPlugin,
  BaseSuperscriptPlugin,
  BaseUnderlinePlugin,
} from "@udecode/plate-basic-marks";
import { BaseBlockquotePlugin } from "@udecode/plate-block-quote";
import {
  BaseCodeBlockPlugin,
  BaseCodeLinePlugin,
  BaseCodeSyntaxPlugin,
} from "@udecode/plate-code-block";
import { BaseCommentsPlugin } from "@udecode/plate-comments";
import { BaseDatePlugin } from "@udecode/plate-date";
import { BaseIndentListPlugin } from "@udecode/plate-indent-list";
import { BaseColumnItemPlugin, BaseColumnPlugin } from "@udecode/plate-layout";
import {
  BaseAudioPlugin,
  BaseFilePlugin,
  BaseImagePlugin,
  BaseMediaEmbedPlugin,
  BaseVideoPlugin,
} from "@udecode/plate-media";

import { Prism } from "../plate-ui/code-block-combobox";

export const plateStaticPlugins = [
  BaseColumnPlugin,
  BaseColumnItemPlugin,
  BaseTocPlugin,
  BaseVideoPlugin,
  BaseAudioPlugin,
  BaseParagraphPlugin,
  BaseHeadingPlugin,
  BaseMediaEmbedPlugin,
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
  BaseSubscriptPlugin,
  BaseSuperscriptPlugin,
  BaseUnderlinePlugin,
  BaseBlockquotePlugin,
  BaseDatePlugin,
  BaseEquationPlugin,
  BaseInlineEquationPlugin,
  BaseCodeBlockPlugin.configure({
    options: {
      prism: Prism,
    },
  }),
  BaseIndentPlugin.extend({
    inject: {
      targetPlugins: [
        BaseParagraphPlugin.key,
        BaseBlockquotePlugin.key,
        BaseCodeBlockPlugin.key,
      ],
    },
  }),
  BaseIndentListPlugin.extend({
    inject: {
      targetPlugins: [
        BaseParagraphPlugin.key,
        ...HEADING_LEVELS,
        BaseBlockquotePlugin.key,
        BaseCodeBlockPlugin.key,
        BaseTogglePlugin.key,
      ],
    },
    options: {
      listStyleTypes: {
        fire: {
          liComponent: FireLiComponent,
          markerComponent: FireMarker,
          type: "fire",
        },
        todo: {
          liComponent: TodoLiStatic,
          markerComponent: TodoMarkerStatic,
          type: "todo",
        },
      },
    },
  }),
  BaseLinkPlugin,
  BaseTableRowPlugin,
  BaseTablePlugin,
  BaseTableCellPlugin,
  BaseHorizontalRulePlugin,
  BaseFontColorPlugin,
  BaseFontBackgroundColorPlugin,
  BaseFontSizePlugin,
  BaseKbdPlugin,
  BaseAlignPlugin.extend({
    inject: {
      targetPlugins: [
        BaseParagraphPlugin.key,
        BaseMediaEmbedPlugin.key,
        ...HEADING_LEVELS,
        BaseImagePlugin.key,
      ],
    },
  }),
  BaseLineHeightPlugin,
  BaseHighlightPlugin,
  BaseFilePlugin,
  BaseImagePlugin,
  BaseMentionPlugin,
  BaseCommentsPlugin,
  BaseTogglePlugin,
];

export const plateStaticComponents = {
  [BaseAudioPlugin.key]: MediaAudioElementStatic,
  [BaseBlockquotePlugin.key]: BlockquoteElementStatic,
  [BaseBoldPlugin.key]: withProps(SlateLeaf, { as: "strong" }),
  [BaseCodeBlockPlugin.key]: CodeBlockElementStatic,
  [BaseCodeLinePlugin.key]: CodeLineElementStatic,
  [BaseCodePlugin.key]: CodeLeafStatic,
  [BaseCodeSyntaxPlugin.key]: CodeSyntaxLeafStatic,
  [BaseColumnItemPlugin.key]: ColumnElementStatic,
  [BaseColumnPlugin.key]: ColumnGroupElementStatic,
  [BaseCommentsPlugin.key]: CommentLeafStatic,
  [BaseDatePlugin.key]: DateElementStatic,
  [BaseEquationPlugin.key]: EquationElementStatic,
  [BaseFilePlugin.key]: MediaFileElementStatic,
  [BaseHighlightPlugin.key]: HighlightLeafStatic,
  [BaseHorizontalRulePlugin.key]: HrElementStatic,
  [BaseImagePlugin.key]: ImageElementStatic,
  [BaseInlineEquationPlugin.key]: InlineEquationElementStatic,
  [BaseItalicPlugin.key]: withProps(SlateLeaf, { as: "em" }),
  [BaseKbdPlugin.key]: KbdLeafStatic,
  [BaseLinkPlugin.key]: LinkElementStatic,
  // [BaseMediaEmbedPlugin.key]: MediaEmbedElementStatic,
  [BaseMentionPlugin.key]: MentionElementStatic,
  [BaseParagraphPlugin.key]: ParagraphElementStatic,
  [BaseStrikethroughPlugin.key]: withProps(SlateLeaf, { as: "del" }),
  [BaseSubscriptPlugin.key]: withProps(SlateLeaf, { as: "sub" }),
  [BaseSuperscriptPlugin.key]: withProps(SlateLeaf, { as: "sup" }),
  [BaseTableCellHeaderPlugin.key]: TableCellHeaderStaticElement,
  [BaseTableCellPlugin.key]: TableCellElementStatic,
  [BaseTablePlugin.key]: TableElementStatic,
  [BaseTableRowPlugin.key]: TableRowElementStatic,
  [BaseTocPlugin.key]: TocElementStatic,
  [BaseTogglePlugin.key]: ToggleElementStatic,
  [BaseUnderlinePlugin.key]: withProps(SlateLeaf, { as: "u" }),
  [BaseVideoPlugin.key]: MediaVideoElementStatic,
  [HEADING_KEYS.h1]: withProps(HeadingElementStatic, { variant: "h1" }),
  [HEADING_KEYS.h2]: withProps(HeadingElementStatic, { variant: "h2" }),
  [HEADING_KEYS.h3]: withProps(HeadingElementStatic, { variant: "h3" }),
  [HEADING_KEYS.h4]: withProps(HeadingElementStatic, { variant: "h4" }),
  [HEADING_KEYS.h5]: withProps(HeadingElementStatic, { variant: "h5" }),
  [HEADING_KEYS.h6]: withProps(HeadingElementStatic, { variant: "h6" }),
};
